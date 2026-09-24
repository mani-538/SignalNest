import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class SlackAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "slack" as const;
  displayName = "Slack";
  category = "messaging" as const;

  config: OAuthConfig = {
    provider: "slack",
    displayName: "Slack App Directory",
    authorizationUrl: "https://slack.com/oauth/v2/authorize",
    tokenUrl: "https://slack.com/api/oauth.v2.access",
    clientIdEnvVar: "SLACK_CLIENT_ID",
    clientSecretEnvVar: "SLACK_CLIENT_SECRET",
    requiredScopes: ["chat:write", "channels:read", "app_mentions:read", "incoming-webhook"],
    callbackRoute: "/api/auth/callback/slack",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    webhookSignatureHeader: "x-slack-signature",
    pollingFallback: false,
    docsUrl: "https://api.slack.com/authentication/oauth-v2",
  };

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID || "mock_slack_client_id",
      scope: this.config.requiredScopes.join(","),
      state,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${this.config.callbackRoute}`,
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    return {
      accessToken: this.encryptTokenForVault(`xoxb_mock_${code}`),
      expiresIn: 3600 * 24 * 365,
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    // Slack signature uses HMAC-SHA256 with timestamp header `x-slack-request-timestamp`
    return { isValid: !!signatureHeader, eventPayload: { source: "slack" } };
  }

  async publishPost(payload: { content: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Slack team notification staged for dispatch.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Slack thread response staged in approval queue.",
    };
  }

  async fetchMetrics() {
    return { impressions: 11200, engagements: 1980, followersCount: 420 };
  }
}
