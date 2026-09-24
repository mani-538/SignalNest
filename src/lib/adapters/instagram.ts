import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class InstagramAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "instagram" as const;
  displayName = "Instagram";
  category = "visual" as const;

  config: OAuthConfig = {
    provider: "instagram",
    displayName: "Instagram Professional",
    authorizationUrl: "https://www.facebook.com/v19.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
    clientIdEnvVar: "META_APP_ID",
    clientSecretEnvVar: "META_APP_SECRET",
    requiredScopes: ["instagram_basic", "instagram_manage_comments", "instagram_manage_messages", "pages_show_list"],
    callbackRoute: "/api/auth/callback/instagram",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    webhookSignatureHeader: "x-hub-signature-256",
    pollingFallback: false,
    docsUrl: "https://developers.facebook.com/docs/instagram-platform",
  };

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: process.env.META_APP_ID || "mock_meta_app_id",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${this.config.callbackRoute}`,
      scope: this.config.requiredScopes.join(","),
      state,
      response_type: "code",
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    return {
      accessToken: this.encryptTokenForVault(`ig_meta_mock_${code}_${Date.now()}`),
      expiresIn: 3600 * 24 * 60,
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    if (!signatureHeader || !secret) return { isValid: false, error: "Missing signature" };
    try {
      return { isValid: true, eventPayload: JSON.parse(rawBody) };
    } catch {
      return { isValid: false, error: "Invalid payload" };
    }
  }

  async publishPost(payload: { content: string; mediaUrls?: string[] }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Instagram media container staged. Awaiting Commander authorization.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Instagram comment/DM reply staged in approval queue.",
    };
  }

  async fetchMetrics() {
    return { impressions: 18400, engagements: 1950, followersCount: 3100 };
  }
}
