import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class YouTubeAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "youtube" as const;
  displayName = "YouTube";
  category = "visual" as const;

  config: OAuthConfig = {
    provider: "youtube",
    displayName: "YouTube (Google Cloud)",
    authorizationUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    clientIdEnvVar: "YOUTUBE_CLIENT_ID",
    clientSecretEnvVar: "YOUTUBE_CLIENT_SECRET",
    requiredScopes: ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"],
    callbackRoute: "/api/auth/callback/youtube",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    pollingFallback: true,
    docsUrl: "https://developers.google.com/youtube/v3",
  };

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: process.env.YOUTUBE_CLIENT_ID || "mock_youtube_client_id",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${this.config.callbackRoute}`,
      scope: this.config.requiredScopes.join(" "),
      response_type: "code",
      access_type: "offline",
      state,
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    return {
      accessToken: this.encryptTokenForVault(`yt_google_mock_${code}`),
      refreshToken: this.encryptTokenForVault(`yt_refresh_${Date.now()}`),
      expiresIn: 3600,
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    return { isValid: true, eventPayload: { source: "youtube" } };
  }

  async publishPost(payload: { content: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "YouTube community update / video metadata staged for approval.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "YouTube comment response queued for approval.",
    };
  }

  async fetchMetrics() {
    return { impressions: 22000, engagements: 1400, followersCount: 4200 };
  }
}
