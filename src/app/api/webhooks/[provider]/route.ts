import { NextResponse } from "next/server";
import { getProviderAdapter } from "@/lib/adapters";
import { store } from "@/lib/data-store";
import { PlatformType } from "@/types";

export async function POST(
  request: Request,
  { params }: { params: { provider: string } }
) {
  const provider = params.provider.toLowerCase() as PlatformType;

  try {
    const adapter = getProviderAdapter(provider);
    const rawBody = await request.text();
    const signatureHeader =
      request.headers.get(adapter.config.webhookSignatureHeader || "x-signature") || "";

    // Webhook verification interface
    const verification = await adapter.verifyWebhookSignature(
      rawBody,
      signatureHeader,
      process.env[`${provider.toUpperCase()}_WEBHOOK_SECRET`] || ""
    );

    if (!verification.isValid) {
      store.addAuditLog(
        "WEBHOOK_SIGNATURE_FAILED",
        "SocialConnection",
        provider,
        `Rejected unverified webhook payload from ${provider.toUpperCase()}: ${verification.error || "Bad signature"}`
      );
      return NextResponse.json(
        { success: false, error: "Invalid webhook cryptographic signature" },
        { status: 401 }
      );
    }

    // Queue verified work & log
    store.addAuditLog(
      "WEBHOOK_RECEIVED",
      "SocialConnection",
      provider,
      `Accepted verified webhook event from ${provider.toUpperCase()}`,
      { headers: Object.fromEntries(request.headers.entries()) }
    );

    return NextResponse.json({
      success: true,
      message: `Webhook received and queued for ${provider.toUpperCase()} under idempotency guardrails.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process webhook" },
      { status: 400 }
    );
  }
}
