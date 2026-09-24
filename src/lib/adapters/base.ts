import { PlatformType } from "@/types";
import { randomBytes } from "crypto";

export interface OAuthConfig {
  provider: PlatformType;
  displayName: string;
  authorizationUrl: string;
  tokenUrl: string;
  clientIdEnvVar: string;
  clientSecretEnvVar: string;
  requiredScopes: string[];
  callbackRoute: string;
  tokenStorageInterface: string;
  webhookSupported: boolean;
  webhookSignatureHeader?: string;
  pollingFallback: boolean;
  docsUrl: string;
}

export interface PublishResult {
  success: boolean;
  postId?: string;
  permalink?: string;
  requiresApproval?: boolean;
  isMock: boolean;
  message: string;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  eventPayload?: Record<string, unknown>;
  error?: string;
}

export interface SocialProviderAdapter {
  provider: PlatformType;
  displayName: string;
  category: "developer" | "professional" | "visual" | "messaging" | "community";
  config: OAuthConfig;

  // Cryptographically strong one-time state used by OAuth callbacks.
  generateOAuthState(): string;

  // Build OAuth authorization URL for user consent
  getAuthorizationUrl(state: string): string;

  // Exchange auth code for encrypted token (returns mock token boundary in MVP)
  exchangeCodeForToken(code: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresIn: number;
    scopes: string[];
  }>;

  // Cryptographic webhook signature verification interface
  verifyWebhookSignature(
    rawBody: string,
    signatureHeader: string,
    secret: string
  ): Promise<WebhookVerificationResult>;

  // Publishing boundary (always approval-guarded in MVP)
  publishPost(payload: {
    content: string;
    mediaUrls?: string[];
    scheduledAt?: string;
  }): Promise<PublishResult>;

  // Public reply boundary (always approval-guarded in MVP)
  sendReply(payload: {
    targetId: string;
    replyContent: string;
  }): Promise<PublishResult>;

  // Metrics fetching interface
  fetchMetrics(): Promise<{
    impressions: number;
    engagements: number;
    followersCount: number;
  }>;
}

export class BaseSocialAdapter {
  protected provider: PlatformType;
  protected config: OAuthConfig;

  constructor(provider: PlatformType, config: OAuthConfig) {
    this.provider = provider;
    this.config = config;
  }

  // Generates safe state for CSRF defense
  generateOAuthState(): string {
    return randomBytes(32).toString("base64url");
  }

  // Encryption helper placeholder for storing OAuth tokens in database vault
  encryptTokenForVault(token: string): string {
    // In production, uses crypto.createCipheriv("aes-256-gcm", vaultKey, iv)
    return `vault:aes256gcm:${Buffer.from(token).toString("base64")}`;
  }

  // Decryption helper placeholder
  decryptTokenFromVault(encrypted: string): string {
    if (!encrypted.startsWith("vault:aes256gcm:")) return encrypted;
    const base64 = encrypted.replace("vault:aes256gcm:", "");
    return Buffer.from(base64, "base64").toString("utf-8");
  }
}
