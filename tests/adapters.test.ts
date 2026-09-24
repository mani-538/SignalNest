import { describe, it, expect } from "vitest";
import { getProviderAdapter, getAllAdapters } from "../src/lib/adapters";
import { PlatformType } from "../src/types";

describe("Social Provider Adapters & OAuth Boundaries", () => {
  const allPlatforms: PlatformType[] = [
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
  ];

  it("registers adapters for all 11 required platforms", () => {
    const adapters = getAllAdapters();
    expect(adapters.length).toBe(11);

    allPlatforms.forEach((p) => {
      const adapter = getProviderAdapter(p);
      expect(adapter).toBeDefined();
      expect(adapter.provider).toBe(p);
      expect(adapter.config.requiredScopes.length).toBeGreaterThan(0);
      expect(adapter.config.tokenStorageInterface).toContain("AES-256-GCM");
    });
  });

  it("generates correct OAuth authorization URLs with state and callback route", () => {
    const gh = getProviderAdapter("github");
    const state = "test_csrf_state_123";
    const authUrl = gh.getAuthorizationUrl(state);

    expect(authUrl).toContain("github.com/login/oauth/authorize");
    expect(authUrl).toContain("state=test_csrf_state_123");
    expect(decodeURIComponent(authUrl)).toContain("/api/auth/callback/github");
  });

  it("verifies webhook signature interface on GitHub adapter", async () => {
    const gh = getProviderAdapter("github");
    const payload = JSON.stringify({ action: "opened", pull_request: { id: 142 } });

    // Valid header prefix
    const result = await gh.verifyWebhookSignature(payload, "sha256=abcdef123456", "my_secret");
    expect(result.isValid).toBe(true);
    expect(result.eventPayload).toBeDefined();

    // Missing header
    const badResult = await gh.verifyWebhookSignature(payload, "", "my_secret");
    expect(badResult.isValid).toBe(false);
  });

  it("enforces approval requirement on publishPost and sendReply in MVP boundary", async () => {
    const li = getProviderAdapter("linkedin");

    const pubResult = await li.publishPost({ content: "Testing approval guard." });
    expect(pubResult.requiresApproval).toBe(true);
    expect(pubResult.isMock).toBe(true);

    const replyResult = await li.sendReply({ targetId: "evt-li-1", replyContent: "Safe reply." });
    expect(replyResult.requiresApproval).toBe(true);
    expect(replyResult.isMock).toBe(true);
  });
});
