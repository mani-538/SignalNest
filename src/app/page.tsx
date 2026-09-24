"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ComposeModal } from "@/components/modals/ComposeModal";
import { ConsentModal } from "@/components/modals/ConsentModal";
import {
  Sparkles,
  Inbox,
  Calendar,
  Boxes,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Plus,
} from "lucide-react";
import { ContentItem, SocialConnection, SocialEvent } from "@/types";

export default function DashboardPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [inboxEvents, setInboxEvents] = useState<SocialEvent[]>([]);
  const [scheduledPosts, setScheduledPosts] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [selectedConnection, setSelectedConnection] = useState<SocialConnection | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [connRes, evRes, cntRes] = await Promise.all([
        fetch("/api/integrations"),
        fetch("/api/events?status=needs_reply"),
        fetch("/api/content"),
      ]);

      const [connData, evData, cntData] = await Promise.all([
        connRes.json(),
        evRes.json(),
        cntRes.json(),
      ]);

      if (connData.data) setConnections(connData.data);
      if (evData.data) setInboxEvents(evData.data);
      if (cntData.data) {
        // filter scheduled & approved posts
        setScheduledPosts(
          cntData.data.filter((item: ContentItem) =>
            ["scheduled", "approved", "needs_approval"].includes(item.status)
          )
        );
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleConnection = async (provider: string, connected: boolean) => {
    await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, connected }),
    });
    await fetchData();
  };

  const greetingTime = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  const connectedCount = connections.filter((c) => c.status === "connected").length;

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <Header
        title="Command Dashboard"
        subtitle="Operational overview across all personal brand channels"
        actions={
          <button
            onClick={() => setIsComposeOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Post</span>
          </button>
        }
      />

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Hero Greeting & Daily Summary */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#131722] via-[#171c2b] to-[#131722] border border-[#1e2434] p-6 shadow-xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 font-mono">
                  EXECUTIVE BRIEF
                </span>
                <span className="text-xs text-slate-400">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-100 mt-2 tracking-tight">
                {greetingTime()}, Mani
              </h2>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                You have <span className="text-indigo-400 font-semibold">{inboxEvents.length} priority notifications</span> requiring approval, <span className="text-indigo-400 font-semibold">{scheduledPosts.length} posts staged</span> in the pipeline, and zero active automated posting leaks. All outbound dispatches are guarded by the human-in-the-loop review policy.
              </p>
            </div>

            {/* Quick Actions Grid */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsComposeOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-600/25 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Draft Post</span>
              </button>

              <Link
                href="/calendar"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1a1f2c] hover:bg-[#232a3c] text-slate-200 border border-[#273044] text-xs font-medium transition-all"
              >
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>Add to Calendar</span>
              </Link>

              <Link
                href="/inbox"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1a1f2c] hover:bg-[#232a3c] text-slate-200 border border-[#273044] text-xs font-medium transition-all"
              >
                <Inbox className="w-3.5 h-3.5 text-amber-400" />
                <span>Review Inbox ({inboxEvents.length})</span>
              </Link>

              <Link
                href="/integrations"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#1a1f2c] hover:bg-[#232a3c] text-slate-200 border border-[#273044] text-xs font-medium transition-all"
              >
                <Boxes className="w-3.5 h-3.5 text-emerald-400" />
                <span>Connect Platform</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Performance Snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-[#11141d] border border-[#1e2434] rounded-xl space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Total Audience Reach
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-100 font-mono">41.8K</span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +14.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Past 7 days across platforms</p>
          </div>

          <div className="p-4 bg-[#11141d] border border-[#1e2434] rounded-xl space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Engagement Rate
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-100 font-mono">7.2%</span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3" /> +0.8%
              </span>
            </div>
            <p className="text-[11px] text-slate-400">High developer trust benchmark</p>
          </div>

          <div className="p-4 bg-[#11141d] border border-[#1e2434] rounded-xl space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Inbox Health
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-amber-400 font-mono">
                {inboxEvents.length} Pending
              </span>
              <span className="text-xs font-mono text-slate-400">Avg 18m reply</span>
            </div>
            <p className="text-[11px] text-slate-400">100% human-approved replies</p>
          </div>

          <div className="p-4 bg-[#11141d] border border-[#1e2434] rounded-xl space-y-1">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Connected Platforms
            </span>
            <div className="flex items-baseline justify-between">
              <span className="text-xl font-bold text-slate-100 font-mono">
                {connectedCount} / {connections.length || 11}
              </span>
              <span className="text-xs text-indigo-400 font-mono">Sandbox Mode</span>
            </div>
            <p className="text-[11px] text-slate-400">11 Official OAuth boundaries ready</p>
          </div>
        </div>

        {/* Connected Platform Cards (Initially Not Connected / Toggleable) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-slate-200">Connected Platforms</h3>
              <span className="text-xs text-slate-400">
                (Click any card to inspect OAuth scopes or test mock connection)
              </span>
            </div>
            <Link
              href="/integrations"
              className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Manage all 11 adapters</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {connections.slice(0, 6).map((conn) => {
              const isConnected = conn.status === "connected";
              return (
                <div
                  key={conn.id}
                  onClick={() => setSelectedConnection(conn)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all hover:scale-[1.02] ${
                    isConnected
                      ? "bg-[#131926] border-indigo-500/40 shadow-sm"
                      : "bg-[#10131c] border-[#1e2434] opacity-80 hover:opacity-100 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <PlatformBadge platform={conn.provider} showLabel={false} size="sm" />
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isConnected ? "bg-emerald-500 shadow-sm shadow-emerald-500/50" : "bg-slate-600"
                      }`}
                    />
                  </div>
                  <div className="mt-2.5">
                    <p className="text-xs font-semibold text-slate-200 capitalize">
                      {conn.provider}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5 truncate">
                      {isConnected ? conn.accountName || "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2-Column Section: Priority Inbox & Scheduled Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Priority Inbox */}
          <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2232]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                  <Inbox className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Today&apos;s Priority Inbox
                  </h3>
                  <p className="text-[11px] text-slate-400">High-impact mentions, PRs & leads</p>
                </div>
              </div>
              <Link
                href="/inbox"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>Open Inbox</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {inboxEvents.slice(0, 3).map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 bg-[#151924] border border-[#1f2638] rounded-xl space-y-2 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={evt.source} size="sm" />
                      <span className="text-xs font-semibold text-slate-200">
                        {evt.authorName}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">
                        {evt.authorHandle}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-red-950/60 text-red-300 border border-red-800/40">
                        Score {evt.priority}
                      </span>
                      <StatusBadge status={evt.sentiment} type="sentiment" />
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {evt.content}
                  </p>

                  <div className="p-2 bg-[#0e1118] border border-[#1a1f2c] rounded-lg">
                    <p className="text-[10px] text-indigo-300 font-medium">
                      AI Suggested Response:
                    </p>
                    <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-0.5">
                      &quot;{evt.suggestedReply}&quot;
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-slate-400">
                      {new Date(evt.occurredAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <Link
                      href="/inbox"
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Review & Approve Reply →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Posts For This Week */}
          <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1c2232]">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Content Pipeline
                  </h3>
                  <p className="text-[11px] text-slate-400">Planned drafts & approved releases</p>
                </div>
              </div>
              <Link
                href="/calendar"
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View Calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="space-y-3">
              {scheduledPosts.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="p-3 bg-[#151924] border border-[#1f2638] rounded-xl space-y-2 hover:border-slate-600 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PlatformBadge platform={post.platform} size="sm" />
                      <span className="text-xs font-semibold text-slate-200">
                        {post.title || post.coreIdea.slice(0, 35)}
                      </span>
                    </div>
                    <StatusBadge status={post.status} />
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {post.draft}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="w-3 h-3 text-indigo-400" />
                      <span>
                        {post.scheduledAt
                          ? new Date(post.scheduledAt).toLocaleDateString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })
                          : "Unscheduled Draft"}
                      </span>
                    </div>
                    <Link
                      href="/studio"
                      className="text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Open in Studio →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onPostCreated={fetchData}
      />

      <ConsentModal
        connection={selectedConnection}
        isOpen={!!selectedConnection}
        onClose={() => setSelectedConnection(null)}
        onToggleConnection={handleToggleConnection}
      />
    </div>
  );
}
