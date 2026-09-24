export type PlatformType =
  | "github"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "x"
  | "youtube"
  | "tiktok"
  | "reddit"
  | "discord"
  | "telegram"
  | "slack";

export type EventType =
  | "COMMENT"
  | "DM"
  | "MENTION"
  | "PR"
  | "ISSUE"
  | "REVIEW"
  | "REACTION"
  | "LEAD";

export type SentimentType = "positive" | "neutral" | "negative" | "urgent";

export type EventStatus =
  | "needs_reply"
  | "draft_saved"
  | "approved"
  | "done"
  | "dismissed";

export type ContentStatus =
  | "idea"
  | "draft"
  | "needs_approval"
  | "approved"
  | "scheduled"
  | "published"
  | "failed";

export type ContentTone =
  | "Thought Leadership"
  | "Technical"
  | "Casual"
  | "Punchy"
  | "Educational"
  | "Storytelling";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "commander" | "admin" | "reviewer" | "member";
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
}

export interface SocialConnection {
  id: string;
  provider: PlatformType;
  accountName: string;
  accountId: string;
  status: "connected" | "disconnected" | "expired" | "pending_consent";
  allowedScopes: string[];
  encryptedTokenPlaceholder: string;
  expiresAt?: string;
  avatarUrl?: string;
  capabilities: string[];
  webhookSupported: boolean;
  pollingFallback: boolean;
}

export interface SocialEvent {
  id: string;
  source: PlatformType;
  type: EventType;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  url: string;
  priority: number; // 1-100
  sentiment: SentimentType;
  status: EventStatus;
  suggestedReply?: string;
  currentReplyDraft?: string;
  aiSummary?: string;
  occurredAt: string;
  tags?: string[];
  approvedAt?: string;
  approvedBy?: string;
}

export interface ContentItem {
  id: string;
  coreIdea: string;
  platform: PlatformType;
  title?: string;
  draft: string;
  status: ContentStatus;
  scheduledAt?: string;
  publishedAt?: string;
  mediaNotes?: string;
  hashtags: string[];
  cta?: string;
  tone: ContentTone;
  targetAudience: string;
  objective?: string;
  characterLimit?: number;
  approvedAt?: string;
  approvedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalRequest {
  id: string;
  actionType: "PUBLISH_POST" | "PUBLIC_REPLY" | "MERGE_RELEASE" | "DELETE_CONTENT";
  targetType: "CONTENT_ITEM" | "SOCIAL_EVENT";
  targetId: string;
  title: string;
  platform: PlatformType;
  summary: string;
  payload: Record<string, unknown>;
  status: "pending" | "approved" | "rejected" | "cancelled";
  reviewer?: string;
  requestedAt: string;
  decidedAt?: string;
  notes?: string;
}

export interface AnalyticsSnapshot {
  date: string;
  platform: PlatformType | "all";
  followersTotal: number;
  followersDelta: number;
  impressions: number;
  reach: number;
  engagements: number;
  engagementRate: number;
  shares: number;
}

export interface NotificationRule {
  id: string;
  name: string;
  condition: "HIGH_PRIORITY_INBOX" | "NEW_PR" | "MENTION_VIP" | "SENTIMENT_URGENT" | "APPROVAL_REQUIRED";
  channel: "IN_APP" | "SLACK" | "DISCORD" | "TELEGRAM" | "EMAIL";
  channelTarget?: string;
  isEnabled: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  resourceType: "ContentItem" | "SocialEvent" | "SocialConnection" | "Settings" | "ApprovalRequest";
  resourceId: string;
  description: string;
  actor: string;
  timestamp: string;
  details?: Record<string, unknown>;
}

export interface BrandSettings {
  userName: string;
  userEmail: string;
  avatarUrl: string;
  timezone: string;
  brandVoice: string;
  writingTone: ContentTone;
  bannedTopics: string[];
  approvalPolicy: {
    alwaysRequireApprovalForReplies: boolean;
    alwaysRequireApprovalForPublishing: boolean;
    notifyOnHighPriority: boolean;
    dualReviewForExecutivePosts: boolean;
  };
}
