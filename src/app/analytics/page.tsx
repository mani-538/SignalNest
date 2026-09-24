"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  MessageCircle,
  Share2,
  Calendar,
  Layers,
  ArrowUpRight,
  Info,
  Radio,
} from "lucide-react";
import { PlatformType } from "@/types";

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [platform, setPlatform] = useState<string>("all");
  const [showLiveEmptyState, setShowLiveEmptyState] = useState(false);

  // Believable seeded performance data
  const metrics = {
    totalReach: platform === "all" ? "142.8K" : "38.2K",
    reachDelta: "+18.4%",
    totalImpressions: platform === "all" ? "218.4K" : "54.1K",
    impressionsDelta: "+12.1%",
    engagementRate: platform === "all" ? "7.2%" : "6.8%",
    engRateDelta: "+0.9%",
    netFollowers: platform === "all" ? "+875" : "+210",
    followersDelta: "+24.5%",
    sharesCount: platform === "all" ? "1,420" : "390",
  };

  const platformBreakdown = [
    { platform: "linkedin" as PlatformType, name: "LinkedIn", followers: "5,200", impressions: "68.2K", rate: "7.8%", color: "bg-blue-500" },
    { platform: "x" as PlatformType, name: "X (Twitter)", followers: "8,900", impressions: "84.5K", rate: "6.4%", color: "bg-zinc-400" },
    { platform: "github" as PlatformType, name: "GitHub", followers: "1,420", impressions: "24.1K", rate: "8.9%", color: "bg-purple-500" },
    { platform: "youtube" as PlatformType, name: "YouTube", followers: "4,200", impressions: "32.0K", rate: "5.7%", color: "bg-red-500" },
    { platform: "instagram" as PlatformType, name: "Instagram", followers: "3,100", impressions: "28.4K", rate: "6.1%", color: "bg-pink-500" },
  ];

  const topPerformingPosts = [
    {
      title: "The Death of Blind Social Automation (Approval-First OS)",
      platform: "linkedin" as PlatformType,
      impressions: "42.8K",
      engagements: "3,120",
      rate: "7.3%",
      date: "Sep 22, 2026",
    },
    {
      title: "Announcing SignalNest v1.0 Launch Tweet",
      platform: "x" as PlatformType,
      impressions: "38.1K",
      engagements: "2,490",
      rate: "6.5%",
      date: "Sep 20, 2026",
    },
    {
      title: "How We Protect Webhooks in Next.js App Router",
      platform: "youtube" as PlatformType,
      impressions: "18.4K",
      engagements: "1,420",
      rate: "7.7%",
      date: "Sep 18, 2026",
    },
    {
      title: "v1.1.0 Release Notes: Zero-Trust Token Vault",
      platform: "github" as PlatformType,
      impressions: "14.2K",
      engagements: "890",
      rate: "6.2%",
      date: "Sep 15, 2026",
    },
  ];

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <Header
        title="Performance Analytics & Growth"
        subtitle="Cross-platform audience engagement, reach, and organic authority metrics"
      />

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Connection Mode Toggle Banner */}
        <div className="p-4 bg-[#11141d] border border-[#1e2434] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Radio className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-slate-100">
                {showLiveEmptyState ? "Live API Streaming Mode" : "Demonstration Snapshot Mode"}
              </h3>
              <p className="text-[11px] text-slate-400">
                {showLiveEmptyState
                  ? "Awaiting official account OAuth connection to stream production API metrics."
                  : "Displaying calibrated demonstration metrics based on developer benchmarks."}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowLiveEmptyState(!showLiveEmptyState)}
            className="px-3 py-1.5 rounded-lg bg-[#1a1f2c] hover:bg-[#242b3c] text-slate-200 border border-[#273044] text-xs font-medium self-start sm:self-auto transition-colors"
          >
            {showLiveEmptyState ? "Switch to Mock Data" : "Preview Live Empty State"}
          </button>
        </div>

        {showLiveEmptyState ? (
          /* Clear Empty State Explaining Official Connection Required */
          <div className="p-12 text-center bg-[#11141d] border border-[#1e2434] rounded-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-center text-indigo-400 mx-auto">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-semibold text-slate-100">
                No Live Analytics Stream Connected
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live performance data will appear here once official OAuth connections are authorized in the Integrations tab. We never scrape or guess metrics.
              </p>
            </div>
            <a
              href="/integrations"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition-all"
            >
              <span>Connect Official Platform</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#11141d] border border-[#1e2434] rounded-2xl">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-medium">Channel:</span>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="px-3 py-1.5 bg-[#090b10] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="all">All Channels (Unified)</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="x">X (Twitter)</option>
                  <option value="github">GitHub</option>
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                {["7d", "30d", "90d", "All Time"].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                      timeRange === range
                        ? "bg-indigo-600/20 text-indigo-300 border border-indigo-500/40"
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-[#11141d] border border-[#1e2434] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Total Reach</span>
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-slate-100 font-mono">
                    {metrics.totalReach}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> {metrics.reachDelta}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Unique accounts viewing dispatches</p>
              </div>

              <div className="p-5 bg-[#11141d] border border-[#1e2434] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Gross Impressions</span>
                  <div className="w-7 h-7 rounded-lg bg-purple-600/10 flex items-center justify-center text-purple-400">
                    <BarChart3 className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-slate-100 font-mono">
                    {metrics.totalImpressions}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> {metrics.impressionsDelta}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Cumulative feed views</p>
              </div>

              <div className="p-5 bg-[#11141d] border border-[#1e2434] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Engagement Rate</span>
                  <div className="w-7 h-7 rounded-lg bg-emerald-600/10 flex items-center justify-center text-emerald-400">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-slate-100 font-mono">
                    {metrics.engagementRate}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> {metrics.engRateDelta}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Clicks, comments, and replies</p>
              </div>

              <div className="p-5 bg-[#11141d] border border-[#1e2434] rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-400">Audience Growth</span>
                  <div className="w-7 h-7 rounded-lg bg-amber-600/10 flex items-center justify-center text-amber-400">
                    <Users className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-bold text-slate-100 font-mono">
                    {metrics.netFollowers}
                  </h3>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> {metrics.followersDelta}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">Net new technical subscribers</p>
              </div>
            </div>

            {/* Platform Comparison Bars & Top Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Channel Share (5 cols) */}
              <div className="lg:col-span-5 bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-100">
                  Channel Authority Breakdown
                </h3>
                <div className="space-y-3">
                  {platformBreakdown.map((item) => (
                    <div key={item.platform} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <PlatformBadge platform={item.platform} showLabel={false} size="sm" />
                          <span className="font-medium text-slate-200">{item.name}</span>
                        </div>
                        <span className="text-slate-400 font-mono">{item.impressions}</span>
                      </div>
                      <div className="w-full h-2 bg-[#090b10] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${item.color} rounded-full`}
                          style={{
                            width: `${
                              (parseInt(item.impressions) / 90) * 100
                            }%`,
                          }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                        <span>{item.followers} followers</span>
                        <span className="text-emerald-400">{item.rate} eng</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Performing Assets (7 cols) */}
              <div className="lg:col-span-7 bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-100">
                  Top Performing Content
                </h3>
                <div className="space-y-3">
                  {topPerformingPosts.map((post, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-[#151924] border border-[#1f2638] rounded-xl flex items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <PlatformBadge platform={post.platform} size="sm" />
                          <span className="text-xs font-semibold text-slate-200 truncate">
                            {post.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          Published {post.date}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-right flex-shrink-0 font-mono">
                        <div>
                          <p className="text-xs font-bold text-slate-200">{post.impressions}</p>
                          <p className="text-[10px] text-slate-400">Views</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-400">{post.rate}</p>
                          <p className="text-[10px] text-slate-400">Eng Rate</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
