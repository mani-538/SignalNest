import { NextResponse } from "next/server";
import { getProviderAdapter } from "@/lib/adapters";

export const runtime = "nodejs";

export async function GET() {
  const adapter = getProviderAdapter("github");
  const state = adapter.generateOAuthState();
  const response = NextResponse.redirect(adapter.getAuthorizationUrl(state));
  response.cookies.set("signalnest_github_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 600,
    path: "/",
  });
  return response;
}
