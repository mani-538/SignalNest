import React from "react";
import { ContentStatus, EventStatus, SentimentType } from "@/types";

interface StatusBadgeProps {
  status: ContentStatus | EventStatus | SentimentType | string;
  type?: "content" | "event" | "sentiment" | "connection";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = "content",
  className = "",
}) => {
  let label = status.replace("_", " ");
  let colorStyles = "bg-slate-800 text-slate-300 border-slate-700";

  switch (status) {
    // Content status
    case "idea":
      colorStyles = "bg-purple-950/60 text-purple-300 border-purple-800/60";
      label = "Idea";
      break;
    case "draft":
      colorStyles = "bg-slate-800/80 text-slate-300 border-slate-700";
      label = "Draft";
      break;
    case "needs_approval":
      colorStyles = "bg-amber-950/70 text-amber-300 border-amber-700/60";
      label = "Needs Approval";
      break;
    case "approved":
      colorStyles = "bg-emerald-950/70 text-emerald-300 border-emerald-700/60";
      label = "Approved";
      break;
    case "scheduled":
      colorStyles = "bg-indigo-950/70 text-indigo-300 border-indigo-700/60";
      label = "Scheduled (Planned)";
      break;
    case "published":
      colorStyles = "bg-teal-950/70 text-teal-300 border-teal-700/60";
      label = "Published";
      break;
    case "failed":
      colorStyles = "bg-rose-950/70 text-rose-300 border-rose-700/60";
      label = "Failed";
      break;

    // Event status
    case "needs_reply":
      colorStyles = "bg-amber-950/70 text-amber-300 border-amber-700/60";
      label = "Needs Reply";
      break;
    case "draft_saved":
      colorStyles = "bg-blue-950/70 text-blue-300 border-blue-700/60";
      label = "Draft Saved";
      break;
    case "done":
      colorStyles = "bg-slate-800 text-slate-400 border-slate-700";
      label = "Done";
      break;
    case "dismissed":
      colorStyles = "bg-zinc-800 text-zinc-500 border-zinc-700";
      label = "Dismissed";
      break;

    // Sentiment
    case "positive":
      colorStyles = "bg-emerald-950/60 text-emerald-300 border-emerald-800/50";
      label = "Positive";
      break;
    case "neutral":
      colorStyles = "bg-slate-800/60 text-slate-300 border-slate-700/60";
      label = "Neutral";
      break;
    case "urgent":
      colorStyles = "bg-rose-950/70 text-rose-300 border-rose-800/70";
      label = "Urgent";
      break;
    case "negative":
      colorStyles = "bg-red-950/60 text-red-300 border-red-800/60";
      label = "Negative";
      break;

    // Connection
    case "connected":
      colorStyles = "bg-emerald-950/60 text-emerald-300 border-emerald-800/60";
      label = "Connected";
      break;
    case "disconnected":
      colorStyles = "bg-zinc-900/80 text-zinc-400 border-zinc-800";
      label = "Not Connected";
      break;
    case "pending_consent":
      colorStyles = "bg-amber-950/60 text-amber-300 border-amber-800/60";
      label = "Consent Pending";
      break;
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border capitalize ${colorStyles} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {label}
    </span>
  );
};
