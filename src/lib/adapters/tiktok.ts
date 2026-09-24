import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class TikTokAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "tiktok" as const;
  displayName = "TikTok";
  category = "visual" as const;

  config: OAuthConfig = {
    provider: "tiktok",
    displayName: "TikTok for Developers",
    authorizationUrl: "https://www.tiktok.com/v2/auth/authorize/",
    tokenUrl: "https://open.tiktokapis.com/v2/oauth/token/",
    clientIdEnvVar: "TIKTOK_CLIENT_KEY",
    clientSecretEnvVar: "TIKTOK_CLIENT_SECRET",
    requiredScopes: ["user.info.basic", "video.upload", "video.publish"],
    callbackRoute: "/api/auth/callback/tiktok",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    pollingFallback: false,
    docsUrl: "https://developers.tiktok.com/doc/overview",
  };

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_key: process.env.TIKTOK_CLIENT_KEY || "mock_tiktok_key",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${this.config.callbackRoute}`,
      scope: this.config.requiredScopes.join(","),
      response_type: "code",
      state,
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    return {
      accessToken: this.encryptTokenForVault(`tt_mock_${code}`),
      expiresIn: 86400,
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    return { isValid: true, eventPayload: { source: "tiktok" } };
  }

  async publishPost(payload: { content: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "TikTok video draft staged. Awaiting approval.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "TikTok comment response staged in approval queue.",
    };
  }

  async fetchMetrics() {
    return { impressions: 16500, engagements: 2100, followersCount: 1980 };
  }
}
