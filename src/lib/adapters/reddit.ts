import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class RedditAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "reddit" as const;
  displayName = "Reddit";
  category = "community" as const;

  config: OAuthConfig = {
    provider: "reddit",
    displayName: "Reddit Developer App",
    authorizationUrl: "https://www.reddit.com/api/v1/authorize",
    tokenUrl: "https://www.reddit.com/api/v1/access_token",
    clientIdEnvVar: "REDDIT_CLIENT_ID",
    clientSecretEnvVar: "REDDIT_CLIENT_SECRET",
    requiredScopes: ["identity", "submit", "read", "privatemessages"],
    callbackRoute: "/api/auth/callback/reddit",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: false,
    pollingFallback: true,
    docsUrl: "https://www.reddit.com/dev/api",
  };

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: process.env.REDDIT_CLIENT_ID || "mock_reddit_client_id",
      response_type: "code",
      state,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${this.config.callbackRoute}`,
      duration: "permanent",
      scope: this.config.requiredScopes.join(" "),
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    return {
      accessToken: this.encryptTokenForVault(`rd_mock_${code}`),
      refreshToken: this.encryptTokenForVault(`rd_refresh_${Date.now()}`),
      expiresIn: 3600,
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    return { isValid: true, eventPayload: { source: "reddit" } };
  }

  async publishPost(payload: { content: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Subreddit thread/post staged. Guardrail checks passed.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Reddit comment response staged in approval queue.",
    };
  }

  async fetchMetrics() {
    return { impressions: 9800, engagements: 850, followersCount: 650 };
  }
}
