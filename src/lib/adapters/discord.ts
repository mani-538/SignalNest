import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class DiscordAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "discord" as const;
  displayName = "Discord";
  category = "messaging" as const;

  config: OAuthConfig = {
    provider: "discord",
    displayName: "Discord Developer Portal",
    authorizationUrl: "https://discord.com/api/oauth2/authorize",
    tokenUrl: "https://discord.com/api/oauth2/token",
    clientIdEnvVar: "DISCORD_CLIENT_ID",
    clientSecretEnvVar: "DISCORD_CLIENT_SECRET",
    requiredScopes: ["bot", "applications.commands", "messages.read"],
    callbackRoute: "/api/auth/callback/discord",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    webhookSignatureHeader: "x-signature-ed25519",
    pollingFallback: true,
    docsUrl: "https://discord.com/developers/docs/intro",
  };

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID || "mock_discord_client_id",
      permissions: "2147483648",
      scope: this.config.requiredScopes.join(" "),
      state,
      response_type: "code",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${this.config.callbackRoute}`,
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    return {
      accessToken: this.encryptTokenForVault(`dc_mock_${code}`),
      expiresIn: 604800,
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    return { isValid: true, eventPayload: { source: "discord" } };
  }

  async publishPost(payload: { content: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Discord channel announcement staged for approval.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Discord community reply staged in approval queue.",
    };
  }

  async fetchMetrics() {
    return { impressions: 14200, engagements: 2800, followersCount: 1750 };
  }
}
