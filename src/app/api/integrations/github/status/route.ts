import { NextResponse } from "next/server";
import { listInstallationRepositories } from "@/lib/github-app";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await listInstallationRepositories();
    return NextResponse.json({
      success: true,
      connected: true,
      repositoryCount: status.repositories.length,
      repositories: status.repositories.map(({ id, name, full_name, private: isPrivate, html_url }) => ({
        id,
        name,
        fullName: full_name,
        private: isPrivate,
        url: html_url,
      })),
      permissions: status.permissions,
      repositorySelection: status.repositorySelection,
      tokenExpiresAt: status.expiresAt,
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      connected: false,
      error: error instanceof Error ? error.message : "GitHub connection check failed",
    }, { status: 503 });
  }
}
