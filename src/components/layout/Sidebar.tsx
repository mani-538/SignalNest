"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Sparkles,
  Calendar,
  BarChart3,
  Boxes,
  Settings,
  ShieldCheck,
  Radio,
  Moon,
  Sun,
  Layers,
} from "lucide-react";

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Unified Inbox", href: "/inbox", icon: Inbox },
  { name: "Content Studio", href: "/studio", icon: Sparkles },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Integrations", href: "/integrations", icon: Boxes },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // default to dark mode
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-[#0e1118] border-r border-[#1a1f2c] flex flex-col justify-between h-screen sticky top-0 select-none z-30">
      <div>
        {/* Brand header */}
        <div className="p-5 flex items-center justify-between border-b border-[#1a1f2c]">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Radio className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
                SignalNest
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded">
                  OS
                </span>
              </div>
              <p className="text-xs text-slate-400">Social Command Center</p>
            </div>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="mt-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? "bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#151924]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-indigo-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] rounded-full border ${
                      item.badgeColor || "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="p-3 border-t border-[#1a1f2c] space-y-2">
        <button
          onClick={toggleTheme}
          type="button"
          className="w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg text-slate-400 hover:bg-[#151924] hover:text-slate-200 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            {isDark ? <Moon className="w-3.5 h-3.5 text-indigo-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isDark ? "Dark SaaS View" : "Light Mode"}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono">
            {isDark ? "ON" : "OFF"}
          </span>
        </button>

        {/* User Card */}
        <div className="p-2.5 rounded-lg bg-[#131722] border border-[#1e2434] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              MS
            </div>
            <div className="leading-none">
              <p className="text-xs font-medium text-slate-200">Mani Shankar</p>
              <p className="text-[10px] text-indigo-400 font-mono mt-0.5">Commander</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-500/20" title="System Online" />
        </div>
      </div>
    </aside>
  );
};
