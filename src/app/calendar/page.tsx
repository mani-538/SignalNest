"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ComposeModal } from "@/components/modals/ComposeModal";
import {
  Calendar as CalendarIcon,
  Plus,
  Filter,
  Copy,
  Trash2,
  Edit3,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  List,
  Grid3X3,
  CalendarRange,
} from "lucide-react";
import { ContentItem, ContentStatus, PlatformType } from "@/types";

type ViewMode = "month" | "week" | "list";

export default function ContentCalendarPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("month");
  const [platformFilter, setPlatformFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/content");
      const json = await res.json();
      if (json.data) {
        setItems(json.data);
      }
    } catch (err) {
      console.error("Failed to load content items:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDuplicate = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coreIdea: item.coreIdea,
          platform: item.platform,
          title: item.title ? `${item.title} (Copy)` : "Copied Draft",
          draft: item.draft,
          status: "draft",
          tone: item.tone,
          targetAudience: item.targetAudience,
          hashtags: item.hashtags,
        }),
      });

      if (res.ok) {
        setNotice("Content item duplicated successfully as draft.");
        setTimeout(() => setNotice(null), 3000);
        await fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content item?")) return;
    try {
      const res = await fetch(`/api/content?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotice("Item deleted from calendar pipeline.");
        setTimeout(() => setNotice(null), 3000);
        await fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: ContentStatus) => {
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setNotice(`Updated status to: ${newStatus}`);
        setTimeout(() => setNotice(null), 3000);
        await fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleReschedule = async (id: string, newDateStr: string) => {
    try {
      const res = await fetch("/api/content", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, scheduledAt: new Date(newDateStr).toISOString() }),
      });
      if (res.ok) {
        setNotice("Post rescheduled successfully in calendar.");
        setTimeout(() => setNotice(null), 3000);
        await fetchItems();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter items
  const filtered = items.filter((item) => {
    if (platformFilter !== "all" && item.platform !== platformFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <Header
        title="Content Calendar & Timeline"
        subtitle="Schedule, review, and organize platform dispatches"
        actions={
          <button
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        }
      />

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Notice Banner */}
        {notice && (
          <div className="p-3.5 bg-indigo-950/40 border border-indigo-700/50 rounded-xl flex items-center justify-between text-xs text-indigo-200 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{notice}</span>
            </div>
          </div>
        )}

        {/* Clear MVP Scheduled Guardrail Disclaimer */}
        <div className="p-3.5 bg-indigo-950/20 border border-indigo-800/30 rounded-xl flex items-start gap-3 text-xs text-indigo-300">
          <ShieldCheck className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-indigo-200">
              Approval-First Calendar Architecture
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
              In this MVP, <strong className="text-indigo-300">&quot;Scheduled&quot;</strong> indicates a planned, internally approved post slot. It is intentionally isolated from live publishing APIs until official OAuth keys are registered. No live dispatches occur automatically.
            </p>
          </div>
        </div>

        {/* Controls Bar: Views & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-[#11141d] border border-[#1e2434] rounded-2xl">
          {/* View Mode Toggle */}
          <div className="flex items-center p-1 bg-[#090b10] border border-[#1a1f2c] rounded-xl self-start">
            <button
              onClick={() => setViewMode("month")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "month"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Month</span>
            </button>

            <button
              onClick={() => setViewMode("week")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "week"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span>Week</span>
            </button>

            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === "list"
                  ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={platformFilter}
              onChange={(e) => setPlatformFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#090b10] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Platforms</option>
              <option value="linkedin">LinkedIn</option>
              <option value="x">X (Twitter)</option>
              <option value="github">GitHub</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#090b10] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Statuses</option>
              <option value="idea">Idea</option>
              <option value="draft">Draft</option>
              <option value="needs_approval">Needs Approval</option>
              <option value="approved">Approved</option>
              <option value="scheduled">Scheduled</option>
              <option value="published">Published</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Calendar Displays */}
        {viewMode === "list" ? (
          /* List View */
          <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl overflow-hidden divide-y divide-[#1c2232]">
            {filtered.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                No items match selected filters
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#151924] transition-colors"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={item.platform} size="sm" />
                      <span className="text-xs font-semibold text-slate-200">
                        {item.title || item.coreIdea.slice(0, 45)}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {item.draft}
                    </p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-indigo-400" />
                        {item.scheduledAt
                          ? new Date(item.scheduledAt).toLocaleString()
                          : "Unscheduled"}
                      </span>
                      <span>Tone: {item.tone}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleDuplicate(item.id)}
                      className="p-1.5 rounded-lg bg-[#0b0e14] hover:bg-[#1a1f2c] text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
                      title="Duplicate Draft"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 rounded-lg bg-[#0b0e14] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    {item.status !== "approved" && (
                      <button
                        onClick={() => handleUpdateStatus(item.id, "approved")}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 text-xs font-medium"
                      >
                        Approve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          /* Grid Month/Week View */
          <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2232]">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-100">
                  September 2026
                </span>
                <span className="text-xs text-slate-400">
                  ({filtered.length} planned dispatches)
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 rounded-lg hover:bg-[#1a1f2c] text-slate-400 hover:text-slate-200">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-[#1a1f2c] text-slate-400 hover:text-slate-200">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days of week header */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-400">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid days */}
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 28 }).map((_, i) => {
                const dayNum = i + 1;
                const isToday = dayNum === 24; // Mock today = 24th
                // Find matching items for this day
                const dayItems = filtered.filter((item) => {
                  if (!item.scheduledAt) return false;
                  const d = new Date(item.scheduledAt).getDate();
                  return d === dayNum;
                });

                return (
                  <div
                    key={i}
                    className={`min-h-[100px] p-2 rounded-xl border flex flex-col justify-between transition-all ${
                      isToday
                        ? "bg-indigo-950/20 border-indigo-500/50 shadow-sm"
                        : "bg-[#0b0e14] border-[#1a1f2c]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span
                        className={`font-mono font-medium ${
                          isToday ? "text-indigo-400 font-bold" : "text-slate-400"
                        }`}
                      >
                        {dayNum}
                      </span>
                      {isToday && (
                        <span className="text-[9px] px-1 bg-indigo-500/20 text-indigo-300 rounded font-mono">
                          TODAY
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 my-1">
                      {dayItems.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleUpdateStatus(item.id, "approved")}
                          className="p-1.5 bg-[#141824] hover:bg-[#1c2234] border border-[#222a3d] rounded-lg cursor-pointer transition-colors text-left"
                          title={`${item.title || item.draft} - Click to approve`}
                        >
                          <div className="flex items-center gap-1">
                            <PlatformBadge platform={item.platform} showLabel={false} size="sm" />
                            <span className="text-[10px] text-slate-200 font-medium truncate">
                              {item.title || item.draft.slice(0, 18)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => setIsComposeOpen(true)}
                      className="text-[10px] text-slate-400 hover:text-indigo-300 text-left flex items-center gap-0.5 mt-auto pt-1"
                    >
                      <Plus className="w-2.5 h-2.5" />
                      <span>Slot</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onPostCreated={fetchItems}
      />
    </div>
  );
}
