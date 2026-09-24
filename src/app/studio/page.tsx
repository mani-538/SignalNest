"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Sparkles,
  Save,
  Send,
  Calendar,
  CheckCircle2,
  RefreshCw,
  Eye,
  Sliders,
  Hash,
  MessageSquare,
  FileCode,
  Share2,
  Layers,
  Check,
} from "lucide-react";
import { ContentTone, PlatformType } from "@/types";
import { GeneratedPlatformDraft } from "@/lib/generator/content-generator";

const ALL_STUDIO_PLATFORMS: PlatformType[] = [
  "linkedin",
  "x",
  "github",
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
];

export default function ContentStudioPage() {
  const [coreIdea, setCoreIdea] = useState(
    "Why approval-first guardrails are essential for AI social OS tools. Automation should give leverage, but public replies and publishing should never go out without explicit human authorization."
  );
  const [objective, setObjective] = useState(
    "Position SignalNest as the premier engineering-grade command center for tech leaders."
  );
  const [targetAudience, setTargetAudience] = useState("Engineering leaders & builders");
  const [tone, setTone] = useState<ContentTone>("Thought Leadership");
  const [cta, setCta] = useState("How does your team ensure quality without burning manual hours?");
  const [hashtags, setHashtags] = useState("#DevTools, #BuildingInPublic, #SocialOS");
  const [mediaNotes, setMediaNotes] = useState("Include dark-mode dashboard screenshot");

  const [generating, setGenerating] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlatformType>("linkedin");
  const [drafts, setDrafts] = useState<Partial<Record<PlatformType, GeneratedPlatformDraft>>>({
    linkedin: {
      platform: "linkedin",
      title: "Perspective: The Death of Blind Automation",
      draft: `Most social media tools treat your audience like a pipeline for auto-generated noise.\n\nHere is what happens when you automate blindly:\n1. Tone-deaf replies during major incidents\n2. Hallucinated release notes that confuse your users\n3. Engagement that sounds like an out-of-touch bot\n\nThat's why we built SignalNest on an approval-first architecture.\n\nAI generates the draft. It suggests the angle. It checks the tone.\n\nBut the final push of the button? Always human.\n\nWhat is your team's policy on public brand posting?`,
      characterLimit: 3000,
      hashtags: ["#BuildingInPublic", "#DevTools", "#SocialOS"],
      cta: "Drop your perspective in the comments below.",
      tone: "Thought Leadership",
      suggestedMedia: "Clean architecture diagram or slide deck PDF",
    },
    x: {
      platform: "x",
      title: "Launch / Hook Tweet",
      draft: `Today we're introducing SignalNest: a personal command center for tech leaders.\n\n✓ Zero browser scraping\n✓ 100% official OAuth & webhook boundaries\n✓ Mandatory human approval queue\n\nTake control of your signal: signalnest.dev #buildinpublic #devtools`,
      characterLimit: 280,
      hashtags: ["#buildinpublic", "#devtools"],
      cta: "Take control of your signal: signalnest.dev",
      tone: "Punchy",
    },
    github: {
      platform: "github",
      title: "v1.2.0 Release Notes: Provider Adapters & Vault",
      draft: `## SignalNest v1.2.0 Release Notes\n\n### 🚀 Highlights\n- **11 Provider Adapters**: Official OAuth boundaries for GitHub, LinkedIn, Meta, X, and YouTube.\n- **Approval-First Queue**: Staged mutations prevent unintended outbound actions.\n- **Zero-Scraping Guarantee**: Complete compliance with platform developer terms.`,
      characterLimit: 10000,
      hashtags: ["#release", "#opensource"],
      cta: "Check diff on GitHub",
      tone: "Technical",
    },
    instagram: {
      platform: "instagram",
      title: "Visual Carousel Caption",
      draft: `Building software shouldn't feel like wrestling with noisy spreadsheets. ✨\n\nHere's our dark-mode command center for SignalNest: built with deep charcoal tones, restrained indigo accents, and clear status signals.\n\nEvery incoming PR, DM, or mention gets scored and queued for one-tap review.\n\nSwipe to explore the system design ➡️\n\n.\n.\n.\n#devtools #darkmode #uiux #dashboarddesign #nextjs #codinglife`,
      characterLimit: 2200,
      hashtags: ["#devtools", "#darkmode", "#uiux", "#codinglife"],
      cta: "Save this post for your next architecture sprint! 📌",
      tone: "Casual",
    },
    facebook: {
      platform: "facebook",
      title: "Community Discussion Post",
      draft: `Hey community! 👋 We just published our technical post on why we refuse to build auto-posting bots that spam social networks without review.\n\nWe'd love to get your thoughts: how does your team review outbound announcements before they go live?\n\n#DevTools #EngineeringLeadership`,
      characterLimit: 5000,
      hashtags: ["#DevTools", "#EngineeringLeadership"],
      cta: "Join the conversation in the comments!",
      tone: "Casual",
    },
    youtube: {
      platform: "youtube",
      title: "How We Built an Approval-First Social OS in Next.js",
      draft: `In this deep dive, we explore how to orchestrate 11 official social APIs while enforcing strict human approval queues.\n\nTimestamps:\n00:00 - The Auto-Posting Problem\n02:30 - Cryptographic Webhooks in App Router\n06:45 - The AES-256 Vault Architecture\n12:10 - Demo & Code Walkthrough\n\nLinks mentioned in this video are in the description below.`,
      characterLimit: 5000,
      hashtags: ["#nextjs", "#typescript", "#architecture"],
      cta: "Subscribe for weekly full-stack system architecture walkthroughs!",
      tone: "Educational",
    },
    tiktok: {
      platform: "tiktok",
      title: "30-Sec Script: Stop Auto-Posting",
      draft: `POV: You stopped using auto-posting bots that post hallucinations at 2 AM 🤦‍♂️\n\nHere is how to set up an approval-first system with Next.js & Prisma that actually protects your brand 🚀\n\nCode snippet is in our bio! Follow for more full-stack hacks. #techtok #coding #programmer`,
      characterLimit: 2200,
      hashtags: ["#techtok", "#coding", "#programmer"],
      cta: "Check bio link for starter kit!",
      tone: "Punchy",
    },
  });

  const [saveNotice, setSaveNotice] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Trigger server-side ContentGenerator abstraction
  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coreIdea,
          objective,
          targetAudience,
          tone,
          cta,
          hashtags,
          mediaNotes,
          platforms: ALL_STUDIO_PLATFORMS,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const map: Partial<Record<PlatformType, GeneratedPlatformDraft>> = { ...drafts };
          json.data.forEach((d: GeneratedPlatformDraft) => {
            map[d.platform] = d;
          });
          setDrafts(map);
          setSaveNotice("AI platform-specific drafts generated successfully!");
          setTimeout(() => setSaveNotice(null), 4000);
        }
      }
    } catch (err) {
      console.error("Draft generation failed:", err);
    } finally {
      setGenerating(false);
    }
  };

  const handleUpdateDraft = (text: string) => {
    setDrafts((prev) => ({
      ...prev,
      [activePlatform]: {
        ...prev[activePlatform]!,
        draft: text,
      },
    }));
  };

  const handleSaveDraft = async (status: "draft" | "needs_approval" | "scheduled") => {
    const activeDraft = drafts[activePlatform];
    if (!activeDraft) return;
    setSaving(true);

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coreIdea,
          platform: activePlatform,
          title: activeDraft.title,
          draft: activeDraft.draft,
          status,
          tone: activeDraft.tone || tone,
          targetAudience,
          hashtags: activeDraft.hashtags || [],
          cta: activeDraft.cta,
          mediaNotes: activeDraft.suggestedMedia,
        }),
      });

      if (res.ok) {
        setSaveNotice(
          `Draft for ${activePlatform.toUpperCase()} saved as "${status}" in approval pipeline!`
        );
        setTimeout(() => setSaveNotice(null), 4000);
      }
    } finally {
      setSaving(false);
    }
  };

  const currentDraft = drafts[activePlatform];
  const charCount = currentDraft?.draft.length || 0;
  const charLimit = currentDraft?.characterLimit || 3000;
  const isOverLimit = charCount > charLimit;

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <Header
        title="Content Studio"
        subtitle="Transform one core thesis into 7 platform-tailored, approval-ready drafts"
      />

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Success / Status Notice */}
        {saveNotice && (
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-700/50 rounded-xl flex items-center justify-between text-xs text-emerald-200 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{saveNotice}</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 uppercase">
              Pipeline Updated
            </span>
          </div>
        )}

        {/* Studio Workspace: 2 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Core Idea Composer & Fields (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4 shadow-lg">
              <div className="flex items-center gap-2 pb-3 border-b border-[#1c2232]">
                <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-100">
                    Core Thesis & Context
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Single source of truth for all channels
                  </p>
                </div>
              </div>

              {/* Core Idea Textarea */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Core Idea / Key Insight
                </label>
                <textarea
                  rows={4}
                  value={coreIdea}
                  onChange={(e) => setCoreIdea(e.target.value)}
                  placeholder="What is the core thought or announcement you want to share?"
                  className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-[#1e2434] rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 leading-relaxed resize-none"
                />
              </div>

              {/* Objective & Target Audience */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Objective
                  </label>
                  <input
                    type="text"
                    value={objective}
                    onChange={(e) => setObjective(e.target.value)}
                    placeholder="e.g. Drive newsletter signups or announce release"
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Target Audience
                    </label>
                    <input
                      type="text"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                      placeholder="e.g. Founders, Devs"
                      className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Writing Tone
                    </label>
                    <select
                      value={tone}
                      onChange={(e) => setTone(e.target.value as ContentTone)}
                      className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Thought Leadership">Thought Leadership</option>
                      <option value="Technical">Technical</option>
                      <option value="Punchy">Punchy</option>
                      <option value="Casual">Casual</option>
                      <option value="Educational">Educational</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Call To Action (CTA)
                  </label>
                  <input
                    type="text"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder="e.g. What is your team's stance? Reply below."
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Hashtags
                    </label>
                    <input
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      placeholder="#tech, #dev"
                      className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">
                      Media / Visual Notes
                    </label>
                    <input
                      type="text"
                      value={mediaNotes}
                      onChange={(e) => setMediaNotes(e.target.value)}
                      placeholder="e.g. Architecture graph"
                      className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Generate Drafts CTA */}
              <button
                onClick={handleGenerate}
                disabled={generating || !coreIdea.trim()}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating 7 Platform Drafts...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Platform Drafts</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Platform Tabs, Live Editor, Character Counter & Preview (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4 shadow-lg flex flex-col h-full">
              {/* Platform Tabs Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#1c2232] overflow-x-auto gap-2">
                <div className="flex items-center gap-1.5 no-scrollbar">
                  {ALL_STUDIO_PLATFORMS.map((p) => {
                    const isActive = activePlatform === p;
                    return (
                      <button
                        key={p}
                        onClick={() => setActivePlatform(p)}
                        className={`transition-all rounded-lg ${
                          isActive
                            ? "ring-2 ring-indigo-500 scale-105"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <PlatformBadge platform={p} size="sm" />
                      </button>
                    );
                  })}
                </div>

                {/* Character Counter with Platform Limit */}
                <div
                  className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                    isOverLimit
                      ? "bg-rose-950/60 text-rose-300 border-rose-800/60"
                      : "bg-[#151924] text-slate-400 border-[#1f2638]"
                  }`}
                >
                  {charCount} / {charLimit} chars
                </div>
              </div>

              {/* Title & Suggested Media Tag */}
              <div className="flex items-center justify-between gap-3">
                <input
                  type="text"
                  value={currentDraft?.title || ""}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    setDrafts((prev) => ({
                      ...prev,
                      [activePlatform]: {
                        ...prev[activePlatform],
                        title: newTitle,
                      },
                    }));
                  }}
                  placeholder="Platform-specific Headline / Hook"
                  className="flex-1 px-3 py-1.5 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs font-semibold text-slate-200 focus:outline-none focus:border-indigo-500"
                />

                {currentDraft?.suggestedMedia && (
                  <span className="text-[10px] text-indigo-400 bg-indigo-950/40 border border-indigo-800/40 px-2 py-1 rounded truncate max-w-xs">
                    Media: {currentDraft.suggestedMedia}
                  </span>
                )}
              </div>

              {/* Live Editable Draft */}
              <div className="flex-1 flex flex-col space-y-1">
                <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                  Editable Draft for {activePlatform.toUpperCase()}
                </label>
                <textarea
                  rows={9}
                  value={currentDraft?.draft || ""}
                  onChange={(e) => handleUpdateDraft(e.target.value)}
                  className="w-full flex-1 px-3.5 py-2.5 bg-[#0b0e14] border border-[#1e2434] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 leading-relaxed font-sans resize-none"
                />
              </div>

              {/* Platform-Specific Live Feed Preview Card */}
              <div className="p-4 bg-[#090b10] border border-[#1a1f2c] rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-[#161a24] pb-2">
                  <div className="flex items-center gap-1.5 font-medium text-indigo-300">
                    <Eye className="w-3.5 h-3.5" />
                    <span className="capitalize">{activePlatform} Feed Preview Mockup</span>
                  </div>
                  <span className="font-mono text-[10px]">Real-time rendering</span>
                </div>

                <div className="p-3 bg-[#11141d] border border-[#1e2434] rounded-lg space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-[10px] font-bold text-white flex items-center justify-center">
                      MS
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">Mani Shankar</p>
                      <p className="text-[10px] text-slate-400">Founder & Engineer • Just now</p>
                    </div>
                  </div>
                  <div className="text-xs text-slate-300 whitespace-pre-line leading-relaxed max-h-40 overflow-y-auto pr-1">
                    {currentDraft?.draft}
                  </div>
                </div>
              </div>

              {/* Footer Actions: Save Draft, Submit for Approval, Schedule */}
              <div className="flex items-center justify-between pt-3 border-t border-[#1c2232]">
                <button
                  onClick={() => handleSaveDraft("draft")}
                  disabled={saving || !currentDraft?.draft.trim()}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-all"
                >
                  <Save className="w-3.5 h-3.5 text-slate-400" />
                  <span>Save Draft</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveDraft("scheduled")}
                    disabled={saving || isOverLimit || !currentDraft?.draft.trim()}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#1b202e] hover:bg-[#252d40] text-indigo-300 border border-indigo-900/40 text-xs font-medium transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Stage in Calendar</span>
                  </button>

                  <button
                    onClick={() => handleSaveDraft("needs_approval")}
                    disabled={saving || isOverLimit || !currentDraft?.draft.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-lg shadow-indigo-600/30 transition-all active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5 text-white" />
                    <span>Send for Approval</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
