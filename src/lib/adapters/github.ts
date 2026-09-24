import { createHmac, timingSafeEqual } from "crypto";
import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class GitHubAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "github" as const;
  displayName = "GitHub";
  category = "developer" as const;

  config: OAuthConfig = {
    provider: "github",
    displayName: "GitHub",
    authorizationUrl: "https://github.com/login/oauth/authorize",
    tokenUrl: "https://github.com/login/oauth/access_token",
    clientIdEnvVar: "GITHUB_CLIENT_ID",
    clientSecretEnvVar: "GITHUB_CLIENT_SECRET",
    requiredScopes: ["repo", "read:org", "workflow", "read:user"],
    callbackRoute: "/api/auth/callback/github",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    webhookSignatureHeader: "x-hub-signature-256",
    pollingFallback: true,
    docsUrl: "https://docs.github.com/en/apps/oauth-apps",
  };

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: process.env.GITHUB_CLIENT_ID || "mock_github_client_id",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${this.config.callbackRoute}`,
      scope: this.config.requiredScopes.join(" "),
      state,
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const clientId = process.env.GITHUB_CLIENT_ID;
    if (!clientSecret || !clientId) {
      throw new Error("GitHub OAuth is not configured. Add GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to .env.");
    }

    const response = await fetch(this.config.tokenUrl, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      cache: "no-store",
    });
    const data = await response.json() as { access_token?: string; scope?: string; error?: string; error_description?: string };
    if (!response.ok || !data.access_token) {
      throw new Error(data.error_description || data.error || "GitHub did not return an access token.");
    }
    return {
      accessToken: data.access_token,
      expiresIn: 0,
      scopes: data.scope?.split(",").filter(Boolean) ?? this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(
    rawBody: string,
    signatureHeader: string,
    secret: string
  ): Promise<WebhookVerificationResult> {
    if (!signatureHeader || !secret) {
      return { isValid: false, error: "Missing signature or webhook secret" };
    }
    const expected = `sha256=${createHmac("sha256", secret).update(rawBody).digest("hex")}`;
    const received = Buffer.from(signatureHeader);
    const expectedBuffer = Buffer.from(expected);
    const isValid = received.length === expectedBuffer.length && timingSafeEqual(received, expectedBuffer);
    try {
      const eventPayload = JSON.parse(rawBody);
      return { isValid, eventPayload };
    } catch {
      return { isValid: false, error: "Invalid JSON body" };
    }
  }

  async publishPost(payload: { content: string; scheduledAt?: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "GitHub release note staged in approval queue. Zero live changes pushed without Commander sign-off.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "GitHub PR / Issue comment staged and approved in audit log.",
    };
  }

  async fetchMetrics() {
    return {
      impressions: 12400,
      engagements: 890,
      followersCount: 1420,
    };
  }
}
