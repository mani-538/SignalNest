"use client";

import React, { useState } from "react";
import { SocialConnection } from "@/types";
import { PlatformBadge } from "../common/PlatformBadge";
import {
  X,
  Shield,
  KeyRound,
  Webhook,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

interface ConsentModalProps {
  connection: SocialConnection | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleConnection: (provider: any, connected: boolean) => Promise<void>;
}

export const ConsentModal: React.FC<ConsentModalProps> = ({
  connection,
  isOpen,
  onClose,
  onToggleConnection,
}) => {
  const [loading, setLoading] = useState(false);

  if (!isOpen || !connection) return null;

  const isConnected = connection.status === "connected";

  const handleAction = async () => {
    setLoading(true);
    try {
      await onToggleConnection(connection.provider, !isConnected);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#11141d] border border-[#1e2434] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#1e2434] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <PlatformBadge platform={connection.provider} size="lg" />
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Official OAuth Boundary & Consent
              </h3>
              <p className="text-xs text-slate-400">Zero-scraping security specification</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#1b202e] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto text-xs text-slate-300">
          {/* Important Security Notice */}
          <div className="p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-amber-300">Sandbox Preview Flow</p>
              <p className="text-amber-200/80 text-[11px] mt-0.5 leading-relaxed">
                In this approval-first MVP, no live social accounts will be touched. Clicking &apos;Connect&apos; simulates an authorized handshake using mock OAuth tokens stored in an AES-256 encrypted placeholder vault.
              </p>
            </div>
          </div>

          {/* Architecture Spec Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-[#151924] border border-[#1f2638] rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-indigo-400 font-medium">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Token Vault</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {connection.encryptedTokenPlaceholder}
              </p>
            </div>

            <div className="p-3 bg-[#151924] border border-[#1f2638] rounded-xl space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-medium">
                <Webhook className="w-3.5 h-3.5" />
                <span>Webhook Ingestion</span>
              </div>
              <p className="text-[11px] text-slate-400">
                {connection.webhookSupported ? "Cryptographic HMAC verified" : "Polling fallback active"}
              </p>
            </div>
          </div>

          {/* Required Scopes */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Required Platform Scopes (Least Privilege)
            </label>
            <div className="flex flex-wrap gap-1.5">
              {connection.allowedScopes.map((scope) => (
                <span
                  key={scope}
                  className="px-2 py-0.5 bg-[#1b202e] border border-[#273044] rounded text-slate-300 font-mono text-[11px]"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Approved Capabilities
            </label>
            <ul className="space-y-1.5">
              {connection.capabilities.map((cap, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-300 text-xs">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                  <span>{cap}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Callback route */}
          <div className="p-3 bg-[#0d0f15] border border-[#1b202e] rounded-xl flex items-center justify-between text-[11px]">
            <div>
              <span className="text-slate-400">Callback Endpoint: </span>
              <code className="text-indigo-300 font-mono">
                /api/auth/callback/{connection.provider}
              </code>
            </div>
            <span className="text-slate-400 text-[10px]">Strict Redirect URI</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0d0f15] border-t border-[#1e2434] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleAction}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 transition-all ${
              isConnected
                ? "bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30"
            }`}
          >
            {loading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : isConnected ? (
              "Disconnect Integration"
            ) : (
              "Authorize Connection (Mock)"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
