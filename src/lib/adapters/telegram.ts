import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class TelegramAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "telegram" as const;
  displayName = "Telegram";
  category = "messaging" as const;

  config: OAuthConfig = {
    provider: "telegram",
    displayName: "Telegram Bot API",
    authorizationUrl: "https://oauth.telegram.org/auth",
    tokenUrl: "https://api.telegram.org/bot",
    clientIdEnvVar: "TELEGRAM_BOT_TOKEN",
    clientSecretEnvVar: "TELEGRAM_BOT_TOKEN",
    requiredScopes: ["getUpdates", "sendMessage", "setWebhook"],
    callbackRoute: "/api/auth/callback/telegram",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    webhookSignatureHeader: "x-telegram-bot-api-secret-token",
    pollingFallback: true,
    docsUrl: "https://core.telegram.org/bots/api",
  };

  getAuthorizationUrl(state: string): string {
    return `https://t.me/SignalNestAlertsBot?start=${state}`;
  }

  async exchangeCodeForToken(code: string) {
    return {
      accessToken: this.encryptTokenForVault(`tg_bot_mock_${code}`),
      expiresIn: 3600 * 24 * 365,
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    return { isValid: true, eventPayload: { source: "telegram" } };
  }

  async publishPost(payload: { content: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Telegram broadcast broadcast staged for approval.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "Telegram direct response staged in approval queue.",
    };
  }

  async fetchMetrics() {
    return { impressions: 6800, engagements: 920, followersCount: 940 };
  }
}
