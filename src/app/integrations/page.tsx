"use client";

import React, { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { PlatformBadge } from "@/components/common/PlatformBadge";
import { StatusBadge } from "@/components/common/StatusBadge";
import { ConsentModal } from "@/components/modals/ConsentModal";
import {
  Boxes,
  Shield,
  KeyRound,
  Webhook,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Info,
  Lock,
} from "lucide-react";
import { PlatformType, SocialConnection } from "@/types";

export default function IntegrationsPage() {
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedConnection, setSelectedConnection] = useState<SocialConnection | null>(null);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/integrations");
      const json = await res.json();
      if (json.data) {
        setConnections(json.data);
      }
    } catch (err) {
      console.error("Failed to load integrations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  const handleToggleConnection = async (provider: PlatformType, connected: boolean) => {
    await fetch("/api/integrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ provider, connected }),
    });
    await fetchConnections();
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 pb-12">
      <Header
        title="Social & Developer Integrations"
        subtitle="11 official OAuth & webhook boundaries engineered for zero scraping"
      />

      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Architecture Security Callout */}
        <div className="p-5 bg-gradient-to-r from-[#111624] via-[#141b2c] to-[#111624] border border-[#1e2434] rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                Official API Boundaries Only
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 uppercase">
                  Zero Scraping Guarantee
                </span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                SignalNest strictly forbids browser scraping, password storing, or private reverse-engineered APIs. All connections follow official OAuth 2.0 authorization code flows with PKCE, least-privilege scopes, cryptographic webhook signatures, and server-side token encryption vaults.
              </p>
            </div>
          </div>
        </div>

        {/* 11 Integration Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {connections.map((conn) => {
            const isConnected = conn.status === "connected";

            return (
              <div
                key={conn.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isConnected
                    ? "bg-[#121622] border-indigo-500/40 shadow-lg shadow-indigo-950/20"
                    : "bg-[#10131c] border-[#1e2434] hover:border-slate-600"
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Icon, Name, Status Badge */}
                  <div className="flex items-center justify-between">
                    <PlatformBadge platform={conn.provider} size="md" />
                    <StatusBadge status={conn.status} type="connection" />
                  </div>

                  {/* Account detail or unconnected placeholder */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100 capitalize">
                      {conn.provider === "x" ? "X (Twitter)" : conn.provider}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {isConnected
                        ? `Connected as ${conn.accountName}`
                        : "Ready for official OAuth consent"}
                    </p>
                  </div>

                  {/* Planned Capabilities */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Planned Capabilities
                    </span>
                    <ul className="space-y-1">
                      {conn.capabilities.slice(0, 3).map((cap, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-1.5 text-[11px] text-slate-300"
                        >
                          <CheckCircle2 className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                          <span className="truncate">{cap}</span>
                        </li>
                      ))}
                      {conn.capabilities.length > 3 && (
                        <li className="text-[10px] text-indigo-400 pl-4 font-mono">
                          +{conn.capabilities.length - 3} more capabilities
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Scopes & Webhook badge row */}
                  <div className="pt-2 flex flex-wrap gap-1.5 border-t border-[#191f2d] text-[10px] font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-[#161a25] text-slate-400 border border-[#202737]">
                      {conn.allowedScopes.length} Scopes
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded border ${
                        conn.webhookSupported
                          ? "bg-emerald-950/40 text-emerald-400 border-emerald-800/40"
                          : "bg-amber-950/40 text-amber-400 border-amber-800/40"
                      }`}
                    >
                      {conn.webhookSupported ? "Webhook Active" : "Polling Gateway"}
                    </span>
                  </div>
                </div>

                {/* Footer Connect / Inspect button */}
                <div className="pt-4 mt-3 border-t border-[#191f2d] flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-mono">
                    Callback: /api/auth/{conn.provider}
                  </span>

                  <button
                    onClick={() => setSelectedConnection(conn)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isConnected
                        ? "bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30"
                    }`}
                  >
                    {isConnected ? "Manage Vault" : "Connect (Preview)"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConsentModal
        connection={selectedConnection}
        isOpen={!!selectedConnection}
        onClose={() => setSelectedConnection(null)}
        onToggleConnection={handleToggleConnection}
      />
    </div>
  );
}
