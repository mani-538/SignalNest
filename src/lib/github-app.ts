import "server-only";
import { createSign } from "crypto";
import { readFile } from "fs/promises";
import path from "path";

type InstallationTokenResponse = {
  token: string;
  expires_at: string;
  permissions: Record<string, string>;
  repository_selection: "all" | "selected";
};

export type GitHubInstallationRepository = {
  id: number;
  name: string;
  full_name: string;
  private: boolean;
  html_url: string;
};

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
}

function base64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

export async function createGitHubAppJwt(): Promise<string> {
  const appId = requiredEnv("GITHUB_APP_ID");
  const privateKeyPath = path.resolve(requiredEnv("GITHUB_PRIVATE_KEY_PATH"));
  const privateKey = await readFile(privateKeyPath, "utf8");
  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(JSON.stringify({ iat: now - 60, exp: now + 9 * 60, iss: appId }));
  const unsignedToken = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  return `${unsignedToken}.${signer.sign(privateKey, "base64url")}`;
}

export async function createInstallationToken(): Promise<InstallationTokenResponse> {
  const installationId = requiredEnv("GITHUB_INSTALLATION_ID");
  const jwt = await createGitHubAppJwt();
  const response = await fetch(`https://api.github.com/app/installations/${installationId}/access_tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${jwt}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "SignalNest",
    },
    cache: "no-store",
  });
  const data = await response.json() as InstallationTokenResponse & { message?: string };
  if (!response.ok || !data.token) throw new Error(data.message || "GitHub installation authentication failed");
  return data;
}

export async function listInstallationRepositories(): Promise<{
  repositories: GitHubInstallationRepository[];
  expiresAt: string;
  permissions: Record<string, string>;
  repositorySelection: string;
}> {
  const installation = await createInstallationToken();
  const response = await fetch("https://api.github.com/installation/repositories?per_page=100", {
    headers: {
      Authorization: `Bearer ${installation.token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "SignalNest",
    },
    cache: "no-store",
  });
  const data = await response.json() as { repositories?: GitHubInstallationRepository[]; message?: string };
  if (!response.ok || !data.repositories) throw new Error(data.message || "Could not read installed repositories");
  return {
    repositories: data.repositories,
    expiresAt: installation.expires_at,
    permissions: installation.permissions,
    repositorySelection: installation.repository_selection,
  };
}
