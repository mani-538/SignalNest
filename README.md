# SignalNest ⚡ — Personal AI-Powered Social Media Command Center

> An approval-first, zero-scraping command center for orchestrating presence across **LinkedIn, GitHub, Instagram, Facebook Pages, X, YouTube, TikTok, Reddit, Discord, Telegram, and Slack**.

---

## 🌟 Architecture & Core Philosophy

SignalNest is engineered for founders, technical leaders, and developers who manage presence across many networks but refuse to risk brand credibility with blind, unreviewed automation.

### 🛡️ Core Guarantees:
1. **Approval-First MVP**: Outbound actions (publishing, scheduling, replying) are staged into a mandatory approval queue. AI drafts at machine speed, but human approval protects the brand.
2. **Zero Browser Scraping / Zero Password Storage**: Exclusively relies on official platform OAuth 2.0 flows, PKCE, and signed webhooks.
3. **AES-256 Vault Architecture**: OAuth tokens are encrypted server-side with AES-256-GCM envelope encryption placeholders before entering database persistence.
4. **Idempotency & Audit Trail**: Every approval, draft modification, and scheduled dispatch is committed to an immutable audit log.

---

## 🖥️ Completed Pages & Capabilities

| Page | Route | Description |
| :--- | :--- | :--- |
| **Command Dashboard** | `/` | Executive summary, connected platform health cards, today's priority inbox snapshot, scheduled content timeline, and quick compose actions. |
| **Unified Inbox** | `/inbox` | Unified triage across PRs, issues, mentions, DMs, and leads. Filter tabs (`Needs reply`, `High priority`, `GitHub`, `Leads`), sentiment badges, AI suggested responses, and one-tap **Approve** / **Save Draft** actions. |
| **Content Studio** | `/studio` | Core thesis composer that generates 7 platform-tailored drafts (`LinkedIn`, `X`, `GitHub Release Notes`, `Instagram`, `Facebook`, `YouTube`, `TikTok`). Includes live character limit meters, platform-accurate feed previews, and approval staging. |
| **Content Calendar** | `/calendar` | Interactive Month, Week, and List views with platform and status filtering (`idea`, `draft`, `needs_approval`, `approved`, `scheduled`). Labelled with planned status isolations. |
| **Analytics & Growth** | `/analytics` | Believable audience reach, engagement rate, impressions, channel breakdown charts, and top-performing asset tables. Includes toggle for live connection empty states. |
| **Integrations** | `/integrations` | Cards for all 11 providers detailing official capabilities, required scopes, webhook verification protocols, and interactive Consent Preview modals. |
| **Settings & Governance** | `/settings` | Commander profile, brand voice guidelines, banned topics, approval policy toggles (`Always require approval for public replies`), notification rules, and full audit trail viewer. |

---

## 🏗️ Technology Stack

- **Framework**: Next.js 14 (App Router) + React 18
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS (Dark-mode first, deep charcoal `#090b10`, soft off-white text, restrained indigo/purple accents `#6366f1`)
- **ORM / Database**: Prisma ORM with PostgreSQL & SQLite dev compatibility
- **Validation**: Zod schema validation for all mutations & inputs
- **Icons**: Lucide React
- **Testing**: Vitest unit test suite

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js `v18.17+` or `v20+` (tested on Node v24)
- npm `v9+` or `v10+`

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/mani-538/SignalNest.git
cd SignalNest

# Install dependencies
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Key variables configured in `.env.example`:
```env
PORT=3000
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="file:./dev.db" # or postgresql://postgres:postgres@localhost:5432/signalnest
APP_SECRET="signalnest_super_secret_master_encryption_key_32chars"
```

### 4. Database Setup (Prisma)
Generate the Prisma Client:
```bash
npx prisma generate
```

### 5. Run the Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

Run the test suite:
```bash
npm test
```
Run type-checking:
```bash
npx tsc --noEmit
```
Run Next.js production build:
```bash
npm run build
```

---

## 🔌 How to Replace Mocks with Live Provider Adapters

SignalNest isolates all platform communications inside `src/lib/adapters/`:
```
src/lib/adapters/
├── base.ts         # SocialProviderAdapter interface & encryption vault helper
├── github.ts       # GitHub App / OAuth & HMAC-SHA256 webhook verifier
├── linkedin.ts     # LinkedIn UGC & Organization OAuth v2 adapter
├── x.ts            # X (Twitter) API v2 OAuth 2.0 PKCE adapter
├── instagram.ts    # Meta Graph API Professional adapter
├── facebook.ts     # Meta Graph Pages adapter
├── youtube.ts      # Google Cloud YouTube Data API v3 adapter
├── tiktok.ts       # TikTok Content Posting API adapter
├── reddit.ts       # Reddit OAuth v1 adapter
├── discord.ts      # Discord Bot & Interaction Webhook adapter
├── telegram.ts     # Telegram Bot API adapter
├── slack.ts        # Slack Block Kit & Signing Secret adapter
└── index.ts        # Central adapter registry
```

### Transition Steps for Live Connections:
1. **GitHub**:
   - Register an OAuth App or GitHub App on GitHub Developer Settings.
   - Set `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, and `GITHUB_WEBHOOK_SECRET` in `.env`.
   - In `src/lib/adapters/github.ts`, swap `exchangeCodeForToken` mock with a live `fetch("https://github.com/login/oauth/access_token", ...)` call.
2. **LinkedIn**:
   - Register an app in LinkedIn Developer Portal and request `w_member_social` permission.
   - Populate `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`.
   - Update `publishPost` to dispatch to `https://api.linkedin.com/v2/ugcPosts`.
3. **Meta (Facebook / Instagram)**:
   - Create a Meta for Developers app, connect your Facebook Page / Instagram Professional ID.
   - Populate `META_APP_ID`, `META_APP_SECRET`, and `META_WEBHOOK_VERIFY_TOKEN`.
4. **AI Generation (`ContentGenerator`)**:
   - To replace the built-in algorithmic generator with live LLMs, set `OPENAI_API_KEY` or `ANTHROPIC_API_KEY` in `.env`.
   - In `src/lib/generator/content-generator.ts`, activate the streaming API call in `generateDrafts()`.

---

## 📜 Security & License

- **License**: MIT
- **Security**: Built strictly with zero-scraping, zero-credential storage, and human-in-the-loop review boundaries.
