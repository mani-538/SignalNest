"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import {
  Settings,
  ShieldCheck,
  User,
  Volume2,
  Bell,
  Clock,
  Download,
  Trash2,
  CheckCircle2,
  History,
  Save,
  AlertTriangle,
  Lock,
} from "lucide-react";
import { BrandSettings, ContentTone, NotificationRule, AuditLog } from "@/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<BrandSettings | null>(null);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [setRes, logRes] = await Promise.all([
        fetch("/api/settings"),
        fetch("/api/audit-logs"),
      ]);

      const [setData, logData] = await Promise.all([
        setRes.json(),
        logRes.json(),
      ]);

      if (setData.data) {
        setSettings(setData.data.settings);
        setRules(setData.data.rules);
      }
      if (logData.data) {
        setAuditLogs(logData.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveSettings = async () => {
    if (!settings) return;
    setSaving(true);

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        setNotice("Brand voice & governance policies updated in system registry.");
        setTimeout(() => setNotice(null), 3000);
        await fetchData();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleAddBannedTopic = () => {
    if (!newTopic.trim() || !settings) return;
    setSettings({
      ...settings,
      bannedTopics: [...settings.bannedTopics, newTopic.trim()],
    });
    setNewTopic("");
  };

  const handleRemoveBannedTopic = (topic: string) => {
    if (!settings) return;
    setSettings({
      ...settings,
      bannedTopics: settings.bannedTopics.filter((t) => t !== topic),
    });
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-16">
      <Header
        title="Settings & System Governance"
        subtitle="Manage Commander profile, brand voice guidelines, and mandatory approval policies"
      />

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Notice alert */}
        {notice && (
          <div className="p-3.5 bg-emerald-950/40 border border-emerald-700/50 rounded-xl flex items-center justify-between text-xs text-emerald-200 animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{notice}</span>
            </div>
          </div>
        )}

        {settings && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Profile, Voice, Policies (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Profile Card */}
              <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1c2232]">
                  <User className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-semibold text-slate-100">
                    Commander Profile
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={settings.userName}
                      onChange={(e) =>
                        setSettings({ ...settings, userName: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-400 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={settings.userEmail}
                      onChange={(e) =>
                        setSettings({ ...settings, userEmail: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-medium text-slate-400 block mb-1">
                      Operational Timezone
                    </label>
                    <input
                      type="text"
                      value={settings.timezone}
                      onChange={(e) =>
                        setSettings({ ...settings, timezone: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Brand Voice & Writing Tone */}
              <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1c2232]">
                  <Volume2 className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-semibold text-slate-100">
                    Brand Voice & Writing Guidelines
                  </h3>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    System Brand Voice Manifesto
                  </label>
                  <textarea
                    rows={4}
                    value={settings.brandVoice}
                    onChange={(e) =>
                      setSettings({ ...settings, brandVoice: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 bg-[#0b0e14] border border-[#1e2434] rounded-xl text-xs text-slate-200 focus:outline-none focus:border-indigo-500 resize-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-400 block mb-1">
                    Default Tone
                  </label>
                  <select
                    value={settings.writingTone}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        writingTone: e.target.value as ContentTone,
                      })
                    }
                    className="w-full px-3 py-2 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Thought Leadership">Thought Leadership</option>
                    <option value="Technical">Technical</option>
                    <option value="Punchy">Punchy</option>
                    <option value="Casual">Casual</option>
                    <option value="Educational">Educational</option>
                  </select>
                </div>

                {/* Banned Topics */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-slate-400 block">
                    Banned Topics & Safety Guardrails
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {settings.bannedTopics.map((topic) => (
                      <span
                        key={topic}
                        className="px-2 py-1 rounded bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-1.5"
                      >
                        <span>{topic}</span>
                        <button
                          onClick={() => handleRemoveBannedTopic(topic)}
                          className="hover:text-rose-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      placeholder="Add banned subject or phrase..."
                      className="flex-1 px-3 py-1.5 bg-[#0b0e14] border border-[#1e2434] rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      onClick={handleAddBannedTopic}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Default Approval Governance Policy */}
              <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1c2232]">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-semibold text-slate-100">
                    Mandatory Approval Governance
                  </h3>
                </div>

                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.approvalPolicy.alwaysRequireApprovalForReplies}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          approvalPolicy: {
                            ...settings.approvalPolicy,
                            alwaysRequireApprovalForReplies: e.target.checked,
                          },
                        })
                      }
                      className="mt-0.5 rounded bg-[#0b0e14] border-[#1e2434] text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        Always require approval for public replies
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Prevents auto-dispatching AI comments or tweets without human confirmation.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.approvalPolicy.alwaysRequireApprovalForPublishing}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          approvalPolicy: {
                            ...settings.approvalPolicy,
                            alwaysRequireApprovalForPublishing: e.target.checked,
                          },
                        })
                      }
                      className="mt-0.5 rounded bg-[#0b0e14] border-[#1e2434] text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        Always require approval for publishing
                      </p>
                      <p className="text-[11px] text-slate-400">
                        All scheduled content items must be reviewed before entering broadcast state.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.approvalPolicy.notifyOnHighPriority}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          approvalPolicy: {
                            ...settings.approvalPolicy,
                            notifyOnHighPriority: e.target.checked,
                          },
                        })
                      }
                      className="mt-0.5 rounded bg-[#0b0e14] border-[#1e2434] text-indigo-600 focus:ring-indigo-500"
                    />
                    <div>
                      <p className="text-xs font-medium text-slate-200">
                        Notify immediately for high-priority activity (Score &gt;= 80)
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Dispatches instant alert to configured webhooks or inbox badges.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Save Settings Button */}
              <div className="flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Configuration</span>
                </button>
              </div>
            </div>

            {/* Right Column: Notification Rules & Audit Trail (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Notification Rules */}
              <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-[#1c2232]">
                  <Bell className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-semibold text-slate-100">
                    Dispatch & Notification Rules
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-3 bg-[#151924] border border-[#1f2638] rounded-xl flex items-center justify-between"
                    >
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-slate-200">{rule.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          Channel: {rule.channel} {rule.channelTarget ? `(${rule.channelTarget})` : ""}
                        </p>
                      </div>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Data Export & Danger Zone Placeholders */}
              <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-semibold text-slate-100">
                  Data Portability & Retention
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => alert("Export initiated: JSON archive of all content and logs queued.")}
                    className="w-full flex items-center justify-between px-3 py-2 bg-[#151924] hover:bg-[#1c2234] border border-[#1f2638] rounded-xl text-xs text-slate-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Export All Workspace Content (JSON)</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Ready</span>
                  </button>

                  <button
                    onClick={() => alert("Account deletion requires primary commander confirmation via 2FA.")}
                    className="w-full flex items-center justify-between px-3 py-2 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 rounded-xl text-xs text-rose-300 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete Workspace & Purge Vaults</span>
                    </span>
                    <span className="text-[10px] font-mono text-rose-400">Danger</span>
                  </button>
                </div>
              </div>

              {/* Immutable Audit Log Viewer */}
              <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#1c2232]">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-semibold text-slate-100">
                      Audit Trail
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {auditLogs.length} events
                  </span>
                </div>

                <div className="space-y-2 max-h-80 overflow-y-auto pr-1 divide-y divide-[#161a25]">
                  {auditLogs.slice(0, 10).map((log) => (
                    <div key={log.id} className="pt-2 text-[11px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-indigo-400 font-medium">
                          {log.action}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-slate-300">{log.description}</p>
                      <p className="text-[10px] text-slate-400">Actor: {log.actor}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
