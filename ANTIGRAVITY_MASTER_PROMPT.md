# Social OS — Antigravity Build Brief

## How to use this file

Paste the **Master Prompt** below into Antigravity. Build the application completely before connecting any live social accounts. Do not use browser scraping, passwords, or unofficial automation. We will connect each platform later with its official OAuth/API flow.

## Master Prompt

```text
Build a polished, responsive web application called “SignalNest”. It is a personal AI-powered social media command center that will eventually manage LinkedIn, GitHub, Instagram, Facebook, X, YouTube, TikTok, Reddit, Discord, Telegram, and future integrations.

Important: build an approval-first MVP. Do NOT connect to real APIs yet. Do NOT use scraping, browser automation, hard-coded credentials, or fake claims that a post was published. Create a realistic product with mock data and a clean integration architecture, so official OAuth/API connections can be added later.

Product goal:
Give one person a single place to plan content, see activity, draft replies, approve actions, and track social performance.

Use a modern full-stack TypeScript web architecture:
- Next.js (App Router) + TypeScript
- Tailwind CSS + accessible component library
- PostgreSQL + Prisma ORM
- Authentication-ready structure (email/social auth can be added later)
- Server actions or API routes for backend operations
- Zod validation
- Clean environment-variable configuration with `.env.example`; never expose secrets in the client
- Responsive design for desktop and mobile

Visual style:
- Premium, calm, dark-mode-first SaaS dashboard
- Light mode supported
- Deep charcoal background, soft off-white text, restrained indigo/purple accent, clear status colors
- Spacious layout, excellent typography, subtle cards and shadows
- Make the product feel useful and complete, not like a generic admin template

Create these pages:

1. Dashboard
- Greeting and short daily summary
- Connected-platform cards (initially show “Not connected”)
- Today’s priority inbox
- Scheduled posts for today/this week
- Content performance snapshot using seeded mock data
- Quick actions: Draft post, Add to calendar, Review inbox, Connect platform

2. Unified Inbox
- Tabs/filters: All, Needs reply, Mentions, Leads, GitHub, High priority, Done
- Mock event cards for comments, DMs, mentions, GitHub PRs/issues/reviews
- Priority score, source platform, timestamp, sentiment, and suggested response
- Detail panel showing original activity, AI summary, suggested reply, edit field, and actions: Save draft, Approve, Mark done
- Never send automatically in this MVP; “Approve” changes state to approved only

3. Content Studio
- Compose one core idea and generate platform-specific drafts for LinkedIn, Instagram, X, Facebook, YouTube, TikTok, and GitHub release notes
- Fields: objective, audience, tone, CTA, media notes, hashtags
- Platform tabs with editable drafts, character counter, platform-specific preview, and Save draft button
- Include mock AI generation using a server-side abstraction (`ContentGenerator`) that can later be swapped for a real AI provider

4. Content Calendar
- Month/week/list views
- Create, edit, reschedule, duplicate, and delete drafts
- Filter by platform and status: idea, draft, needs approval, approved, scheduled, published, failed
- In this MVP, “scheduled” means planned only; clearly label it as not yet connected to a publishing API

5. Analytics
- Mock but believable growth, engagement, reach, follower, and content-performance metrics
- Platform filter and time range filter
- Clear empty state explaining that live data appears after an official account connection

6. Integrations
- Cards for LinkedIn, GitHub, Instagram, Facebook Pages, X, YouTube, TikTok, Reddit, Discord, Telegram, and Slack
- Every card lists planned capabilities and its connection status
- “Connect” opens a consent-preview modal, not real OAuth yet
- Add a clear structure for future OAuth: provider name, required scopes, callback route, token storage interface, webhook support flag, polling fallback flag
- GitHub capabilities: repo activity, issues, pull requests, releases, comments, webhooks
- LinkedIn capabilities: create posts, comments, reactions, organization pages, analytics subject to app approval
- Instagram/Facebook capabilities: professional/page content, comments, insights subject to Meta permissions
- Other networks: show only capabilities officially available through their eventual API and mark restricted features appropriately

7. Settings
- Profile, brand voice, writing tone, banned topics, default approval policy, notification settings, timezone, data export/delete placeholders
- Allow rules such as “always require approval for public replies” and “notify me immediately for high priority activity”

Core data model:
- User
- Workspace
- SocialConnection (provider, account name, status, allowed scopes, encrypted token placeholder, expiresAt)
- SocialEvent (source, type, author, content, URL, priority, sentiment, status, occurredAt)
- ContentItem (core idea, platform, draft, status, scheduledAt, publishedAt, media metadata)
- ApprovalRequest (action type, target, payload, status, reviewer, timestamps)
- AnalyticsSnapshot
- NotificationRule
- AuditLog

Security and reliability requirements:
- Build official-integration boundaries only; OAuth tokens must be server-side and encryption-ready
- Validate all inputs
- Role/permission checks throughout
- Audit log every approval, scheduling action, and future publish attempt
- Idempotency-ready action jobs and provider adapters
- Webhook endpoints should be designed to verify signatures and queue work; do not implement live secrets
- Provide error and loading states everywhere
- Seed local mock data for a convincing demo

Engineering quality:
- Use reusable components and a clear folder structure
- Include a README with setup, local database setup, environment variables, architecture, and how to replace mocks with real provider adapters
- Include `.env.example`
- Add basic tests for validation and key server logic
- Run lint/typecheck/tests and fix errors before declaring completion

Deliverable:
Return the completed source code and a concise list of completed pages, how to run it, and which pieces are mock vs ready for live integration. After all quality checks pass, make one clean, properly described initial Git commit and push it to the GitHub repository that I provide. Do not create or push any commit until the application is complete and the lint, typecheck, and tests have passed.
```

## What Antigravity should complete now

- A working, visually polished web app with local mock data.
- All main screens, workflow states, approval queue, content calendar, and provider-ready data model.
- No real external accounts connected yet.

## What we will do next

After the app is complete, connect platforms one at a time through official APIs:

1. GitHub: OAuth/GitHub App, repository selection, webhook verification, PR/issue/release events.
2. LinkedIn: OAuth, posting permission, then request any required advanced/community-management permissions.
3. Meta: connect Facebook Pages and Instagram Professional accounts, request content/comment/insights permissions.
4. Notifications: Telegram, Slack, email, or mobile push.
5. Add other platforms only after confirming their current API permissions and your intended workflows.

## Acceptance checklist

- [ ] Dashboard, Inbox, Studio, Calendar, Analytics, Integrations, and Settings work with mock data.
- [ ] Public replies and publishing always require approval.
- [ ] No credentials, scraping, or unofficial account automation.
- [ ] Provider adapter and OAuth boundary exist for every listed platform.
- [ ] README and `.env.example` are present.
- [ ] Lint, typecheck, and tests pass.
