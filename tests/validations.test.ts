import { describe, it, expect } from "vitest";
import {
  ContentItemCreateSchema,
  EventActionSchema,
  GenerateContentSchema,
  BrandSettingsSchema,
} from "../src/lib/validations";

describe("Validation Schemas", () => {
  it("validates ContentItem creation successfully", () => {
    const valid = {
      coreIdea: "Why approval-first systems protect brand integrity",
      platform: "linkedin",
      title: "The Approval First Principle",
      draft: "AI drafts at machine speed, humans approve.",
      status: "draft",
      tone: "Thought Leadership",
      targetAudience: "Founders",
      hashtags: ["#buildinpublic"],
    };

    const result = ContentItemCreateSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it("fails when ContentItem coreIdea is too short", () => {
    const invalid = {
      coreIdea: "ab",
      platform: "x",
      draft: "test draft",
    };

    const result = ContentItemCreateSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("validates EventActionSchema actions", () => {
    const validApprove = {
      eventId: "evt-gh-1",
      action: "approve",
      replyContent: "Approved review comment.",
    };

    const result = EventActionSchema.safeParse(validApprove);
    expect(result.success).toBe(true);
  });

  it("rejects unknown EventAction action", () => {
    const invalidAction = {
      eventId: "evt-gh-1",
      action: "auto_post_unapproved", // strictly disallowed
    };

    const result = EventActionSchema.safeParse(invalidAction);
    expect(result.success).toBe(false);
  });

  it("validates GenerateContentSchema requires at least one platform", () => {
    const valid = {
      coreIdea: "Building an enterprise social command center with zero-scraping APIs.",
      targetAudience: "Engineers",
      tone: "Technical",
      platforms: ["linkedin", "x", "github"],
    };

    const result = GenerateContentSchema.safeParse(valid);
    expect(result.success).toBe(true);

    const invalid = {
      coreIdea: "Valid idea but missing platforms",
      platforms: [],
    };
    expect(GenerateContentSchema.safeParse(invalid).success).toBe(false);
  });

  it("validates BrandSettingsSchema governance structure", () => {
    const valid = {
      userName: "Mani Shankar",
      userEmail: "commander@signalnest.dev",
      timezone: "UTC+05:30",
      brandVoice: "Authoritative, technically precise, calm, and visionary.",
      writingTone: "Thought Leadership",
      bannedTopics: ["Political debates", "Crypto shilling"],
      approvalPolicy: {
        alwaysRequireApprovalForReplies: true,
        alwaysRequireApprovalForPublishing: true,
        notifyOnHighPriority: true,
        dualReviewForExecutivePosts: false,
      },
    };

    const result = BrandSettingsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });
});
