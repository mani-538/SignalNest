"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Inbox,
  CheckCircle2,
  Save,
  Send,
  Sparkles,
  ExternalLink,
  Filter,
  ShieldCheck,
  Search,
  Check,
  RefreshCw,
  AlertCircle,
  Tag,
  Clock,
  User,
} from "lucide-react";
import { EventStatus, SocialEvent } from "@/types";

type FilterTab =
  | "all"
  | "needs_reply"
  | "mentions"
  | "leads"
  | "github"
  | "high_priority"
  | "done";

export default function UnifiedInboxPage() {
  const [events, setEvents] = useState<SocialEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<FilterTab>("needs_reply");
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.data) {
        setEvents(data.data);
        if (!selectedEventId && data.data.length > 0) {
          setSelectedEventId(data.data[0].id);
          setReplyText(data.data[0].currentReplyDraft || data.data[0].suggestedReply || "");
        }
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const selectedEvent = events.find((e) => e.id === selectedEventId) || events[0];

  useEffect(() => {
    if (selectedEvent) {
      setReplyText(selectedEvent.currentReplyDraft || selectedEvent.suggestedReply || "");
    }
  }, [selectedEventId]);

  // Tab filtering logic
  const filteredEvents = events.filter((e) => {
    if (activeTab === "all") return true;
    if (activeTab === "needs_reply") return e.status === "needs_reply";
    if (activeTab === "mentions") return e.type === "MENTION";
    if (activeTab === "leads") return e.type === "LEAD" || e.type === "DM";
    if (activeTab === "github") return e.source === "github";
    if (activeTab === "high_priority") return e.priority >= 80;
    if (activeTab === "done") return e.status === "done" || e.status === "approved";
    return true;
  });

  const handleAction = async (action: "save_draft" | "approve" | "mark_done") => {
    if (!selectedEvent) return;
    setActionLoading(true);

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          action,
          replyContent: replyText,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        // Update local state
        setEvents((prev) =>
          prev.map((item) => (item.id === selectedEvent.id ? result.data : item))
        );

        const notices = {
          save_draft: "Reply draft saved to local buffer.",
          approve:
            "State updated to 'Approved'! (MVP guardrail active: never sends automatically without live OAuth dispatch).",
          mark_done: "Marked activity as resolved and completed.",
        };
        setActionNotice(notices[action]);
        setTimeout(() => setActionNotice(null), 4000);
      }
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-screen">
      <Header
        title="Unified Social & Code Inbox"
        subtitle="Prioritized triage across PRs, issues, mentions, comments, and DMs"
      />

      <div className="flex-1 flex min-h-0">
        {/* Left Column: Filter Tabs & Event List */}
        <div className="w-full lg:w-[480px] border-r border-[#1a1f2c] flex flex-col bg-[#0b0e14]">
          {/* Filter Tabs */}
          <div className="p-3 border-b border-[#1a1f2c] overflow-x-auto flex items-center gap-1.5 no-scrollbar">
            {(
              [
                { id: "all", label: "All" },
                { id: "needs_reply", label: "Needs Reply" },
                { id: "high_priority", label: "High Priority" },
                { id: "github", label: "GitHub" },
                { id: "mentions", label: "Mentions" },
                { id: "leads", label: "Leads" },
                { id: "done", label: "Done" },
              ] as { id: FilterTab; label: string }[]
            ).map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#151924]"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Event Items List */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#161b26]">
            {loading ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin mx-auto text-indigo-400" />
                <p className="text-xs">Loading triage stream...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="p-12 text-center text-slate-400 space-y-2">
                <Inbox className="w-8 h-8 mx-auto text-slate-400" />
                <p className="text-xs">No notifications in this filter tab</p>
              </div>
            ) : (
              filteredEvents.map((evt) => {
                const isSelected = selectedEvent?.id === evt.id;
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedEventId(evt.id);
                      setReplyText(evt.currentReplyDraft || evt.suggestedReply || "");
                    }}
                    className={`p-4 cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#141824] border-l-2 border-indigo-500"
                        : "hover:bg-[#10131d]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <PlatformBadge platform={evt.source} size="sm" />
                        <span className="text-xs font-semibold text-slate-200">
                          {evt.authorName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {evt.type}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-950/60 text-red-300 border border-red-800/40">
                          {evt.priority}
                        </span>
                        <StatusBadge status={evt.sentiment} type="sentiment" />
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                      {evt.content}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-mono">
                        {new Date(evt.occurredAt).toLocaleDateString([], {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <StatusBadge status={evt.status} type="event" />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Selected Activity Detail Panel */}
        <div className="hidden lg:flex flex-1 flex-col bg-[#0e1118] overflow-y-auto">
          {selectedEvent ? (
            <div className="p-6 max-w-4xl mx-auto w-full space-y-6">
              {/* Alert Notice on Action */}
              {actionNotice && (
                <div className="p-3.5 bg-indigo-950/40 border border-indigo-700/50 rounded-xl flex items-center justify-between text-xs text-indigo-200 animate-in fade-in duration-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{actionNotice}</span>
                  </div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase">
                    Audit Logged
                  </span>
                </div>
              )}

              {/* Event Header & Metadata */}
              <div className="p-5 bg-[#131722] border border-[#1e2434] rounded-2xl space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-200 text-sm overflow-hidden">
                      {selectedEvent.authorName
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-100">
                          {selectedEvent.authorName}
                        </h2>
                        <span className="text-xs text-slate-400 font-mono">
                          {selectedEvent.authorHandle}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <PlatformBadge platform={selectedEvent.source} size="sm" />
                        <span className="text-[11px] text-slate-400">
                          {new Date(selectedEvent.occurredAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <StatusBadge status={selectedEvent.status} type="event" />
                    <a
                      href={selectedEvent.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-[#1a1f2c] hover:bg-[#232a3c] text-slate-300 border border-slate-700 transition-colors"
                      title="View original event"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Original Activity Content */}
                <div className="p-4 bg-[#0d0f15] border border-[#1a1f2c] rounded-xl text-xs text-slate-200 leading-relaxed font-sans">
                  {selectedEvent.content}
                </div>

                {/* AI Summary Badge */}
                {selectedEvent.aiSummary && (
                  <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl space-y-1">
                    <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI Activity Synthesis</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {selectedEvent.aiSummary}
                    </p>
                  </div>
                )}
              </div>

              {/* Guardrail Policy Disclaimer */}
              <div className="p-3 bg-amber-950/20 border border-amber-800/30 rounded-xl flex items-start gap-2.5 text-xs text-amber-300/90">
                <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <span className="font-semibold text-amber-300">Approval-First Policy: </span>
                  SignalNest will never post public responses automatically. Review and edit the AI-suggested draft below, then approve. Outbound actions remain staged in the approval audit log.
                </p>
              </div>

              {/* Suggested Reply & Editing Field */}
              <div className="bg-[#131722] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs font-bold text-slate-200">
                      AI Suggested Response Draft
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {replyText.length} characters
                  </span>
                </div>

                <textarea
                  rows={5}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Edit response before approving..."
                  className="w-full px-3.5 py-2.5 bg-[#0d0f15] border border-[#1e2434] rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />

                {/* Actions: Save Draft, Approve, Mark Done */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <button
                    onClick={() => handleAction("mark_done")}
                    disabled={actionLoading}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-all"
                  >
                    <Check className="w-3.5 h-3.5 text-slate-400" />
                    <span>Mark Done (No Reply)</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAction("save_draft")}
                      disabled={actionLoading || !replyText.trim()}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1b202e] hover:bg-[#252d40] text-slate-200 border border-[#273147] text-xs font-medium transition-all"
                    >
                      <Save className="w-3.5 h-3.5 text-slate-400" />
                      <span>Save Draft</span>
                    </button>

                    <button
                      onClick={() => handleAction("approve")}
                      disabled={actionLoading || !replyText.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                    >
                      {actionLoading ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                      )}
                      <span>Approve Reply</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-xs">
              Select an item on the left to triage
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
