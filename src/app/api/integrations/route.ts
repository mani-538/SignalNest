import { NextResponse } from "next/server";
import { store } from "@/lib/data-store";
import { getProviderAdapter, getAllAdapters } from "@/lib/adapters";
import { PlatformType } from "@/types";

export async function GET() {
  try {
    const connections = store.getConnections();
    const adapters = getAllAdapters();

    const merged = connections.map((conn) => {
      const adapter = adapters.find((a) => a.provider === conn.provider);
      return {
        ...conn,
        oauthConfig: adapter?.config,
        category: adapter?.category,
      };
    });

    return NextResponse.json({ success: true, count: merged.length, data: merged });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { provider, connected } = body as { provider: PlatformType; connected: boolean };

    if (!provider) {
      return NextResponse.json({ success: false, error: "Provider required" }, { status: 400 });
    }

    const adapter = getProviderAdapter(provider);
    if (provider === "github" && connected) {
      return NextResponse.json({ success: false, error: "Use the GitHub OAuth flow to connect this account." }, { status: 400 });
    }
    const updated = store.toggleConnection(provider, connected);

    return NextResponse.json({
      success: true,
      message: `${adapter.displayName} ${connected ? "connection is not available yet" : "disconnected"}.`,
      data: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
