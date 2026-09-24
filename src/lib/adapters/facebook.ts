import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class FacebookAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "facebook" as const;
  displayName = "Facebook Pages";
  category = "professional" as const;

  config: OAuthConfig = {
    provider: "facebook",
    displayName: "Facebook Pages",
    authorizationUrl: "https://www.facebook.com/v19.0/dialog/oauth",
    tokenUrl: "https://graph.facebook.com/v19.0/oauth/access_token",
    clientIdEnvVar: "META_APP_ID",
    clientSecretEnvVar: "META_APP_SECRET",
    requiredScopes: ["pages_manage_posts", "pages_read_engagement", "pages_messaging"],
    callbackRoute: "/api/auth/callback/facebook",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    webhookSignatureHeader: "x-hub-signature-256",
    pollingFallback: true,
    docsUrl: "https://developers.facebook.com/docs/pages",
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
      accessToken: this.encryptTokenForVault(`fb_page_mock_${code}`),
      expiresIn: 3600 * 24 * 60,
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    return { isValid: !!signatureHeader, eventPayload: { source: "facebook" } };
  }

  async publishPost(payload: { content: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Facebook Page feed post staged in approval queue.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Facebook Page comment reply staged in approval queue.",
    };
  }

  async fetchMetrics() {
    return { impressions: 8900, engagements: 620, followersCount: 1850 };
  }
}
