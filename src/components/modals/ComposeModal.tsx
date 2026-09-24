"use client";

import React, { useState } from "react";
import { PlatformType, ContentTone } from "@/types";
import { PlatformBadge } from "../common/PlatformBadge";
import { X, Sparkles, Send, Calendar, Clock, Check } from "lucide-react";

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: () => void;
}

const platformsList: PlatformType[] = [
  "linkedin",
  "x",
  "github",
  "instagram",
  "facebook",
  "youtube",
  "tiktok",
];

export const ComposeModal: React.FC<ComposeModalProps> = ({
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [platform, setPlatform] = useState<PlatformType>("linkedin");
  const [title, setTitle] = useState("");
  const [draft, setDraft] = useState("");
  const [tone, setTone] = useState<ContentTone>("Thought Leadership");
  const [scheduledAt, setScheduledAt] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (status: "draft" | "needs_approval" | "scheduled") => {
    if (!draft.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coreIdea: draft.slice(0, 100),
          platform,
          title: title || undefined,
          draft,
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          tone,
          targetAudience: "Community & Builders",
          hashtags: ["#SignalNest", "#BuildInPublic"],
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
          if (onPostCreated) onPostCreated();
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#1e2434] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Draft Content</h3>
              <p className="text-xs text-slate-400">Approval-first dispatch pipeline</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1b202e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Target platform selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Target Platform</label>
            <div className="flex flex-wrap gap-2">
              {platformsList.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`transition-all rounded-lg ${
                    platform === p
                      ? "ring-2 ring-indigo-500 scale-105"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <PlatformBadge platform={p} size="sm" />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="text-xs font-medium text-slate-300 block mb-1">
              Internal Title / Headline (Optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q4 Architectural Shift Summary"
              className="w-full px-3 py-2 bg-[#151924] border border-[#222a3d] rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Draft text */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Draft Content</label>
              <span className="text-[11px] text-slate-400 font-mono">
                {draft.length} chars
              </span>
            </div>
            <textarea
              rows={5}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Write your draft here..."
              className="w-full px-3 py-2 bg-[#151924] border border-[#222a3d] rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 resize-none font-sans"
            />
          </div>

          {/* Schedule Date & Tone */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">
                Planned Schedule (MVP Mock)
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#151924] border border-[#222a3d] rounded-lg text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as ContentTone)}
                className="w-full px-3 py-2 bg-[#151924] border border-[#222a3d] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="Thought Leadership">Thought Leadership</option>
                <option value="Technical">Technical</option>
                <option value="Punchy">Punchy</option>
                <option value="Casual">Casual</option>
                <option value="Educational">Educational</option>
              </select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0d0f15] border-t border-[#1e2434] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
          >
            Discard
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSubmit("draft")}
              disabled={loading || !draft.trim()}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs text-slate-300 hover:bg-slate-700 transition-colors"
            >
              Save as Draft
            </button>

            <button
              onClick={() => handleSubmit("needs_approval")}
              disabled={loading || !draft.trim()}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-medium text-white shadow-md shadow-indigo-600/30 flex items-center gap-1.5 transition-all"
            >
              {success ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Staged!</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit for Approval</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
