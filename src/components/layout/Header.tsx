"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  Search,
  Sparkles,
  ShieldAlert,
  ArrowUpRight,
} from "lucide-react";
import { ComposeModal } from "../modals/ComposeModal";

interface HeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, actions }) => {
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  return (
    <header className="h-16 px-6 bg-[#0e1118]/80 backdrop-blur-md border-b border-[#1a1f2c] flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 className="text-lg font-semibold text-slate-100 tracking-tight flex items-center gap-2">
          {title}
        </h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* Environment / Approval Guard badge */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-300">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
          <span className="text-[11px] font-mono">MVP Sandbox (Approval Guard Active)</span>
        </div>

        {actions}

        {/* Global Quick Action: Compose */}
        <button
          onClick={() => setIsComposeOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/25 transition-all active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Draft Post</span>
        </button>

        <ComposeModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
      </div>
    </header>
  );
};
