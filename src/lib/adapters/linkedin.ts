import { BaseSocialAdapter, OAuthConfig, PublishResult, SocialProviderAdapter, WebhookVerificationResult } from "./base";

export class LinkedInAdapter extends BaseSocialAdapter implements SocialProviderAdapter {
  provider = "linkedin" as const;
  displayName = "LinkedIn";
  category = "professional" as const;

  config: OAuthConfig = {
    provider: "linkedin",
    displayName: "LinkedIn",
    authorizationUrl: "https://www.linkedin.com/oauth/v2/authorization",
    tokenUrl: "https://www.linkedin.com/oauth/v2/accessToken",
    clientIdEnvVar: "LINKEDIN_CLIENT_ID",
    clientSecretEnvVar: "LINKEDIN_CLIENT_SECRET",
    requiredScopes: ["openid", "profile", "w_member_social", "r_organization_social"],
    callbackRoute: "/api/auth/callback/linkedin",
    tokenStorageInterface: "AES-256-GCM server-side encrypted vault",
    webhookSupported: true,
    webhookSignatureHeader: "x-li-signature",
    pollingFallback: true,
    docsUrl: "https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow",
  };

  getAuthorizationUrl(state: string): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: process.env.LINKEDIN_CLIENT_ID || "mock_linkedin_client_id",
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}${this.config.callbackRoute}`,
      scope: this.config.requiredScopes.join(" "),
      state,
    });
    return `${this.config.authorizationUrl}?${params.toString()}`;
  }

  async exchangeCodeForToken(code: string) {
    return {
      accessToken: this.encryptTokenForVault(`aq_li_mock_${code}_${Date.now()}`),
      refreshToken: this.encryptTokenForVault(`aq_li_refresh_${Date.now()}`),
      expiresIn: 3600 * 24 * 60, // 60 days
      scopes: this.config.requiredScopes,
    };
  }

  async verifyWebhookSignature(rawBody: string, signatureHeader: string, secret: string): Promise<WebhookVerificationResult> {
    if (!signatureHeader) return { isValid: false, error: "Missing x-li-signature" };
    try {
      return { isValid: true, eventPayload: JSON.parse(rawBody) };
    } catch {
      return { isValid: false, error: "Invalid JSON" };
    }
  }

  async publishPost(payload: { content: string; scheduledAt?: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "LinkedIn UGC post staged. Human-in-the-loop approval active.",
    };
  }

  async sendReply(payload: { targetId: string; replyContent: string }): Promise<PublishResult> {
    return {
      success: true,
      requiresApproval: true,
      isMock: true,
      message: "LinkedIn reply staged in approval queue.",
    };
  }

  async fetchMetrics() {
    return { impressions: 34100, engagements: 2180, followersCount: 5200 };
  }
}
