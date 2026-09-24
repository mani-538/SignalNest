import { ContentTone, PlatformType } from "@/types";

export interface GenerationInput {
  coreIdea: string;
  objective?: string;
  targetAudience: string;
  tone: ContentTone;
  cta?: string;
  hashtags?: string;
  mediaNotes?: string;
  platforms: PlatformType[];
}

export interface GeneratedPlatformDraft {
  platform: PlatformType;
  title?: string;
  draft: string;
  characterLimit: number;
  hashtags: string[];
  cta?: string;
  tone: ContentTone;
  suggestedMedia?: string;
}

export interface IContentGenerator {
  generateDrafts(input: GenerationInput): Promise<GeneratedPlatformDraft[]>;
}

export class ContentGenerator implements IContentGenerator {
  async generateDrafts(input: GenerationInput): Promise<GeneratedPlatformDraft[]> {
    const {
      coreIdea,
      objective,
      targetAudience,
      tone,
      cta,
      hashtags: rawHashtags,
      mediaNotes,
      platforms,
    } = input;

    const parsedHashtags = rawHashtags
      ? rawHashtags.split(/[,\s]+/).map((h) => (h.startsWith("#") ? h : `#${h}`))
      : ["#SignalNest", "#BuildInPublic", "#Engineering"];

    const drafts: GeneratedPlatformDraft[] = [];

    for (const platform of platforms) {
      switch (platform) {
        case "linkedin":
          drafts.push({
            platform: "linkedin",
            title: `Perspective: ${coreIdea.slice(0, 50)}...`,
            draft: this.formatLinkedInDraft(coreIdea, targetAudience, tone, cta, parsedHashtags),
            characterLimit: 3000,
            hashtags: parsedHashtags.slice(0, 5),
            cta: cta || "What has been your experience? Share your thoughts below.",
            tone,
            suggestedMedia: mediaNotes || "Clean architecture diagram or slide deck PDF",
          });
          break;

        case "x":
          drafts.push({
            platform: "x",
            title: "Punchy Announcement / Hook Tweet",
            draft: this.formatXTweet(coreIdea, cta, parsedHashtags),
            characterLimit: 280,
            hashtags: parsedHashtags.slice(0, 3),
            cta: cta || "Thoughts? 🧵👇",
            tone,
            suggestedMedia: mediaNotes || "Terminal screenshot or 10-second GIF",
          });
          break;

        case "github":
          drafts.push({
            platform: "github",
            title: `Release / Technical Notes: ${coreIdea.slice(0, 40)}`,
            draft: this.formatGitHubRelease(coreIdea, targetAudience, objective),
            characterLimit: 10000,
            hashtags: ["#release", "#opensource"],
            cta: "View repository diff & submit issues on GitHub",
            tone: "Technical",
            suggestedMedia: "Architecture markdown diagram / benchmark graphs",
          });
          break;

        case "instagram":
          drafts.push({
            platform: "instagram",
            title: "Visual Story & Caption",
            draft: this.formatInstagramDraft(coreIdea, tone, cta, parsedHashtags),
            characterLimit: 2200,
            hashtags: [...parsedHashtags, "#codinglife", "#techcommunity", "#softwareengineer", "#minimalism"],
            cta: cta || "Double-tap if you relate & save this for your next architecture review! 🔖",
            tone,
            suggestedMedia: mediaNotes || "1080x1350 High-contrast dark-mode card carousel",
          });
          break;

        case "facebook":
          drafts.push({
            platform: "facebook",
            title: "Community Discussion Post",
            draft: this.formatFacebookDraft(coreIdea, cta, parsedHashtags),
            characterLimit: 5000,
            hashtags: parsedHashtags.slice(0, 3),
            cta: cta || "Join our developer group to discuss further.",
            tone,
            suggestedMedia: mediaNotes || "Link preview card with 1200x630 banner",
          });
          break;

        case "youtube":
          drafts.push({
            platform: "youtube",
            title: `How We Built This: ${coreIdea.slice(0, 45)} (Engineering Breakdown)`,
            draft: this.formatYouTubeDraft(coreIdea, cta, parsedHashtags),
            characterLimit: 5000,
            hashtags: parsedHashtags.slice(0, 5),
            cta: cta || "Subscribe for next week's deep-dive code review.",
            tone: "Educational",
            suggestedMedia: mediaNotes || "16:9 4K video recording with code editor split-screen",
          });
          break;

        case "tiktok":
          drafts.push({
            platform: "tiktok",
            title: "Short-form Script & Hook",
            draft: this.formatTikTokDraft(coreIdea, cta, parsedHashtags),
            characterLimit: 2200,
            hashtags: [...parsedHashtags.slice(0, 3), "#techtok", "#programmer", "#devtools"],
            cta: cta || "Link in bio to check it out! 👆",
            tone: "Punchy",
            suggestedMedia: mediaNotes || "9:16 vertical video with kinetic typography captions",
          });
          break;

        case "reddit":
          drafts.push({
            platform: "reddit",
            title: `[Show / Ask] ${coreIdea.slice(0, 60)}: What's your experience?`,
            draft: this.formatRedditDraft(coreIdea, targetAudience),
            characterLimit: 40000,
            hashtags: [],
            cta: "Looking forward to hearing how you handle this in your production stack.",
            tone: "Technical",
          });
          break;

        case "discord":
        case "telegram":
        case "slack":
          drafts.push({
            platform,
            title: `${platform.toUpperCase()} Broadcast Announcement`,
            draft: `📢 **Announcement**: ${coreIdea}\n\nKey takeaways:\n• Built with safety-first guardrails\n• Full approval queue before posting\n\n👉 ${cta || "Check out the updates in our workspace dashboard!"}`,
            characterLimit: 2000,
            hashtags: [],
            cta: cta || "Join the discussion in the thread.",
            tone,
          });
          break;
      }
    }

    return drafts;
  }

  private formatLinkedInDraft(
    coreIdea: string,
    audience: string,
    tone: string,
    cta?: string,
    hashtags: string[] = []
  ): string {
    return `Most teams approach social distribution the wrong way.\n\n${coreIdea}\n\nHere are 3 core principles we follow when speaking to ${audience}:\n\n1. Signal over noise — If it doesn't teach, clarify, or inspire, it shouldn't be published.\n2. Respect your reader's timeline — Get to the point in the first 3 lines.\n3. Human-in-the-loop — AI drafts at machine speed, but human approval protects brand credibility.\n\n${cta || "How does your team ensure high content quality without burning hours?"}\n\n${hashtags.slice(0, 5).join(" ")}`;
  }

  private formatXTweet(coreIdea: string, cta?: string, hashtags: string[] = []): string {
    const hook = coreIdea.length > 170 ? `${coreIdea.slice(0, 167)}...` : coreIdea;
    const callToAction = cta ? `\n\n${cta}` : "";
    const tags = hashtags.length > 0 ? ` ${hashtags.slice(0, 2).join(" ")}` : "";
    const full = `${hook}${callToAction}${tags}`;
    return full.length > 280 ? full.slice(0, 277) + "..." : full;
  }

  private formatGitHubRelease(coreIdea: string, audience: string, objective?: string): string {
    return `## Summary\n\n${coreIdea}\n\n### 🎯 Objective\n${objective || "Provide robust, audited automation capabilities for engineering teams."}\n\n### 📦 Highlights\n- **Zero-Scraping Guarantee**: Built exclusively on verified, official platform OAuth & API specs.\n- **Mandatory Approval Workflow**: Staging boundary prevents accidental public dispatch.\n- **Cryptographic Webhook Verification**: Constant-time signature checks for incoming events.\n\n### 👥 Target Audience\n${audience}\n\n### 🔗 Useful Links\n- Documentation: https://signalnest.dev/docs\n- Changelog: https://signalnest.dev/changelog`;
  }

  private formatInstagramDraft(coreIdea: string, tone: string, cta?: string, hashtags: string[] = []): string {
    return `Building with intention ✨\n\n${coreIdea}\n\n---\nSwipe through to see the full breakdown and system architecture ➡️\n\n${cta || "Double-tap and save this post for later! 📌"}\n\n.\n.\n.\n${hashtags.join(" ")}`;
  }

  private formatFacebookDraft(coreIdea: string, cta?: string, hashtags: string[] = []): string {
    return `Hey community! 👋\n\n${coreIdea}\n\nWe'd love to get your feedback on this approach.\n\n${cta || "Leave your thoughts below or send us a message!"}\n\n${hashtags.slice(0, 3).join(" ")}`;
  }

  private formatYouTubeDraft(coreIdea: string, cta?: string, hashtags: string[] = []): string {
    return `In this video, we break down: ${coreIdea}\n\n⏱️ Chapters:\n00:00 - Introduction & The Big Problem\n02:15 - Architecture & Design Decisions\n06:30 - Live Demo & Workflow Walkthrough\n11:45 - Key Lessons Learned\n15:20 - Next Steps\n\n🔔 ${cta || "Don't forget to like and subscribe for more deep dives!"}\n\n${hashtags.join(" ")}`;
  }

  private formatTikTokDraft(coreIdea: string, cta?: string, hashtags: string[] = []): string {
    return `POV: You stopped using auto-posting bots that post hallucinations at 2 AM 🤦‍♂️\n\n"${coreIdea.slice(0, 100)}..."\n\nHere is how to set up an approval-first system that actually works 🚀\n\n${cta || "Follow for part 2!"}\n\n${hashtags.join(" ")}`;
  }

  private formatRedditDraft(coreIdea: string, audience: string): string {
    return `Hey everyone,\n\nI've been thinking about this challenge recently:\n\n> ${coreIdea}\n\nWhen designing systems for ${audience}, the biggest friction is finding the balance between automation leverage and human brand safety.\n\nCurious how other teams tackle this: do you use automated pipelines, strict PR review workflows, or manual dispatch?\n\nWould love to discuss technical trade-offs in the comments.`;
  }
}

export const contentGenerator = new ContentGenerator();
