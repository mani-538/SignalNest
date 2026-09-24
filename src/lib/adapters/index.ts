import { PlatformType } from "@/types";
import { SocialProviderAdapter } from "./base";
import { GitHubAdapter } from "./github";
import { LinkedInAdapter } from "./linkedin";
import { InstagramAdapter } from "./instagram";
import { FacebookAdapter } from "./facebook";
import { XAdapter } from "./x";
import { YouTubeAdapter } from "./youtube";
import { TikTokAdapter } from "./tiktok";
import { RedditAdapter } from "./reddit";
import { DiscordAdapter } from "./discord";
import { TelegramAdapter } from "./telegram";
import { SlackAdapter } from "./slack";

export * from "./base";
export * from "./github";
export * from "./linkedin";
export * from "./instagram";
export * from "./facebook";
export * from "./x";
export * from "./youtube";
export * from "./tiktok";
export * from "./reddit";
export * from "./discord";
export * from "./telegram";
export * from "./slack";

const adapterInstances: Record<PlatformType, SocialProviderAdapter> = {
  github: new GitHubAdapter("github", new GitHubAdapter("github", {} as any).config),
  linkedin: new LinkedInAdapter("linkedin", new LinkedInAdapter("linkedin", {} as any).config),
  instagram: new InstagramAdapter("instagram", new InstagramAdapter("instagram", {} as any).config),
  facebook: new FacebookAdapter("facebook", new FacebookAdapter("facebook", {} as any).config),
  x: new XAdapter("x", new XAdapter("x", {} as any).config),
  youtube: new YouTubeAdapter("youtube", new YouTubeAdapter("youtube", {} as any).config),
  tiktok: new TikTokAdapter("tiktok", new TikTokAdapter("tiktok", {} as any).config),
  reddit: new RedditAdapter("reddit", new RedditAdapter("reddit", {} as any).config),
  discord: new DiscordAdapter("discord", new DiscordAdapter("discord", {} as any).config),
  telegram: new TelegramAdapter("telegram", new TelegramAdapter("telegram", {} as any).config),
  slack: new SlackAdapter("slack", new SlackAdapter("slack", {} as any).config),
};

export function getProviderAdapter(provider: PlatformType): SocialProviderAdapter {
  const adapter = adapterInstances[provider];
  if (!adapter) {
    throw new Error(`Provider adapter for "${provider}" not found in registry`);
  }
  return adapter;
}

export function getAllAdapters(): SocialProviderAdapter[] {
  return Object.values(adapterInstances);
}
