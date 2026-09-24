import { z } from "zod";

export const PlatformTypeSchema = z.enum([
  "github",
  "linkedin",
  "instagram",
  "facebook",
  "x",
  "youtube",
  "tiktok",
  "reddit",
  "discord",
  "telegram",
  "slack",
]);

export const EventStatusSchema = z.enum([
  "needs_reply",
  "draft_saved",
  "approved",
  "done",
  "dismissed",
]);

export const ContentStatusSchema = z.enum([
  "idea",
  "draft",
  "needs_approval",
  "approved",
  "scheduled",
  "published",
  "failed",
]);

export const ContentToneSchema = z.enum([
  "Thought Leadership",
  "Technical",
  "Casual",
  "Punchy",
  "Educational",
  "Storytelling",
]);

export const GenerateContentSchema = z.object({
  coreIdea: z.string().min(5, "Core idea must be at least 5 characters"),
  objective: z.string().optional(),
  targetAudience: z.string().default("Tech founders & builders"),
  tone: ContentToneSchema.default("Thought Leadership"),
  cta: z.string().optional(),
  hashtags: z.string().optional(),
  mediaNotes: z.string().optional(),
  platforms: z.array(PlatformTypeSchema).min(1, "Select at least one platform"),
});

export const ContentItemCreateSchema = z.object({
  coreIdea: z.string().min(3, "Core idea is required"),
  platform: PlatformTypeSchema,
  title: z.string().optional(),
  draft: z.string().min(1, "Draft content is required"),
  status: ContentStatusSchema.default("draft"),
  scheduledAt: z.string().optional().nullable(),
  mediaNotes: z.string().optional(),
  hashtags: z.array(z.string()).default([]),
  cta: z.string().optional(),
  tone: ContentToneSchema.default("Thought Leadership"),
  targetAudience: z.string().default("Audience"),
  objective: z.string().optional(),
});

export const ContentItemUpdateSchema = z.object({
  id: z.string(),
  draft: z.string().optional(),
  title: z.string().optional(),
  status: ContentStatusSchema.optional(),
  scheduledAt: z.string().optional().nullable(),
  mediaNotes: z.string().optional(),
  hashtags: z.array(z.string()).optional(),
  cta: z.string().optional(),
  tone: ContentToneSchema.optional(),
});

export const EventActionSchema = z.object({
  eventId: z.string(),
  action: z.enum(["save_draft", "approve", "mark_done", "dismiss"]),
  replyContent: z.string().optional(),
  notes: z.string().optional(),
});

export const BrandSettingsSchema = z.object({
  userName: z.string().min(2),
  userEmail: z.string().email(),
  timezone: z.string(),
  brandVoice: z.string().min(10),
  writingTone: ContentToneSchema,
  bannedTopics: z.array(z.string()),
  approvalPolicy: z.object({
    alwaysRequireApprovalForReplies: z.boolean(),
    alwaysRequireApprovalForPublishing: z.boolean(),
    notifyOnHighPriority: z.boolean(),
    dualReviewForExecutivePosts: z.boolean(),
  }),
});

export type GenerateContentInput = z.infer<typeof GenerateContentSchema>;
export type ContentItemCreateInput = z.infer<typeof ContentItemCreateSchema>;
export type ContentItemUpdateInput = z.infer<typeof ContentItemUpdateSchema>;
export type EventActionInput = z.infer<typeof EventActionSchema>;
export type BrandSettingsInput = z.infer<typeof BrandSettingsSchema>;
