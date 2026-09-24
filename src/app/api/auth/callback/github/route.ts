import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { getProviderAdapter } from "@/lib/adapters";
import { store } from "@/lib/data-store";

export const runtime = "nodejs";

type GitHubProfile = { id: number; login: string; avatar_url?: string };

export async function GET(request: NextRequest) {
  const failure = (message: string) => NextResponse.redirect(new URL(`/integrations?github_error=${encodeURIComponent(message)}`, request.url));
  const error = request.nextUrl.searchParams.get("error");
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const savedState = request.cookies.get("signalnest_github_oauth_state")?.value;
  if (error || !code || !state || !savedState) return failure(error || "GitHub authorization was cancelled or expired.");
  const matches = Buffer.byteLength(state) === Buffer.byteLength(savedState) && timingSafeEqual(Buffer.from(state), Buffer.from(savedState));
  if (!matches) return failure("GitHub authorization could not be verified. Please try again.");

  try {
    const token = await getProviderAdapter("github").exchangeCodeForToken(code);
    const profileResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${token.accessToken}`, Accept: "application/vnd.github+json" },
      cache: "no-store",
    });
    if (!profileResponse.ok) throw new Error("GitHub profile could not be retrieved.");
    const profile = await profileResponse.json() as GitHubProfile;
    const connection = store.completeGitHubOAuth({ accountId: String(profile.id), accountName: profile.login, avatarUrl: profile.avatar_url, scopes: token.scopes });
    store.addAuditLog("CONNECTED_PROVIDER", "SocialConnection", connection.id, `Connected GitHub account @${profile.login} through OAuth.`);
    const response = NextResponse.redirect(new URL("/integrations?github_connected=1", request.url));
    response.cookies.set("signalnest_github_oauth_state", "", { httpOnly: true, path: "/", maxAge: 0 });
    return response;
  } catch (cause) {
    return failure(cause instanceof Error ? cause.message : "GitHub connection failed.");
  }
}
