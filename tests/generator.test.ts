import { describe, it, expect } from "vitest";
import { ContentGenerator } from "../src/lib/generator/content-generator";
import { PlatformType } from "../src/types";

describe("ContentGenerator Abstraction", () => {
  const generator = new ContentGenerator();

  it("generates platform-tailored drafts for all requested platforms", async () => {
    const platforms: PlatformType[] = [
      "linkedin",
      "x",
      "github",
      "instagram",
      "facebook",
      "youtube",
      "tiktok",
    ];

    const drafts = await generator.generateDrafts({
      coreIdea: "Why human-in-the-loop approval workflows protect developer brand reputation.",
      objective: "Drive thought leadership among founders and open source maintainers.",
      targetAudience: "Engineers & Founders",
      tone: "Thought Leadership",
      cta: "What is your team's publishing policy?",
      hashtags: "#buildinpublic, #devtools",
      platforms,
    });

    expect(drafts.length).toBe(7);

    // Verify platform draft characteristics
    const xDraft = drafts.find((d) => d.platform === "x");
    expect(xDraft).toBeDefined();
    expect(xDraft!.draft.length).toBeLessThanOrEqual(280);

    const liDraft = drafts.find((d) => d.platform === "linkedin");
    expect(liDraft).toBeDefined();
    expect(liDraft!.draft).toContain("Signal over noise");

    const ghDraft = drafts.find((d) => d.platform === "github");
    expect(ghDraft).toBeDefined();
    expect(ghDraft!.draft).toContain("## Summary");

    const igDraft = drafts.find((d) => d.platform === "instagram");
    expect(igDraft).toBeDefined();
    expect(igDraft!.draft).toContain("Swipe through");
  });
});
