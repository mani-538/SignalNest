import React from "react";
import { PlatformType } from "@/types";
import {
  Github,
  Linkedin,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Video,
  MessageSquare,
  Hash,
  Send,
  Slack,
} from "lucide-react";

interface PlatformBadgeProps {
  platform: PlatformType;
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const platformMeta: Record<
  PlatformType,
  {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    bgDark: string;
    textDark: string;
    borderDark: string;
  }
> = {
  github: {
    name: "GitHub",
    icon: Github,
    bgDark: "bg-slate-800/80",
    textDark: "text-slate-200",
    borderDark: "border-slate-700",
  },
  linkedin: {
    name: "LinkedIn",
    icon: Linkedin,
    bgDark: "bg-blue-950/70",
    textDark: "text-blue-300",
    borderDark: "border-blue-800/60",
  },
  instagram: {
    name: "Instagram",
    icon: Instagram,
    bgDark: "bg-pink-950/60",
    textDark: "text-pink-300",
    borderDark: "border-pink-800/50",
  },
  facebook: {
    name: "Facebook",
    icon: Facebook,
    bgDark: "bg-indigo-950/60",
    textDark: "text-indigo-300",
    borderDark: "border-indigo-800/50",
  },
  x: {
    name: "X (Twitter)",
    icon: Twitter,
    bgDark: "bg-zinc-800/80",
    textDark: "text-zinc-200",
    borderDark: "border-zinc-700",
  },
  youtube: {
    name: "YouTube",
    icon: Youtube,
    bgDark: "bg-red-950/60",
    textDark: "text-red-300",
    borderDark: "border-red-800/50",
  },
  tiktok: {
    name: "TikTok",
    icon: Video,
    bgDark: "bg-cyan-950/60",
    textDark: "text-cyan-300",
    borderDark: "border-cyan-800/50",
  },
  reddit: {
    name: "Reddit",
    icon: MessageSquare,
    bgDark: "bg-orange-950/60",
    textDark: "text-orange-300",
    borderDark: "border-orange-800/50",
  },
  discord: {
    name: "Discord",
    icon: Hash,
    bgDark: "bg-violet-950/60",
    textDark: "text-violet-300",
    borderDark: "border-violet-800/50",
  },
  telegram: {
    name: "Telegram",
    icon: Send,
    bgDark: "bg-sky-950/60",
    textDark: "text-sky-300",
    borderDark: "border-sky-800/50",
  },
  slack: {
    name: "Slack",
    icon: Slack,
    bgDark: "bg-emerald-950/60",
    textDark: "text-emerald-300",
    borderDark: "border-emerald-800/50",
  },
};

export const PlatformBadge: React.FC<PlatformBadgeProps> = ({
  platform,
  showLabel = true,
  size = "md",
  className = "",
}) => {
  const meta = platformMeta[platform] || platformMeta.github;
  const Icon = meta.icon;

  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-xs gap-1",
    md: "px-2.5 py-1 text-xs gap-1.5",
    lg: "px-3 py-1.5 text-sm gap-2",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-3.5 h-3.5",
    lg: "w-4 h-4",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-md border ${meta.bgDark} ${meta.textDark} ${meta.borderDark} ${sizeClasses[size]} ${className}`}
    >
      <Icon className={iconSizes[size]} />
      {showLabel && <span>{meta.name}</span>}
    </span>
  );
};
