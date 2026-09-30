# Implementation status

_Last updated: Phase 1, initial build._

## Completed
- Design system: brand tokens (Tailwind v4 `@theme`), Marcellus + Figtree type, flat SVG PATHD mark, favicon
- Brand asset: `public/brand/pathd-logo.png` (dollar signs removed)
- Landing page: hero with animated example route, No Hidden Pay, Map Your Career tour, community section, pricing, footer
- Pricing page and plan catalog (`src/lib/plans.ts`)
- Salary rules (`src/lib/salary`): three distinct sources, integrity assertions, DB check constraints
- PATHD Match engine (`src/lib/match`): deterministic, weighted, fully explained, protected traits excluded; unit tests
- Job search: URL-driven filters (text, min pay, distance, work style, industry, pay-only, sort), salary-first JobCard
- Job detail page with "Why you match" breakdown and estimate explanations
- Onboarding flow: purposes, resume upload, review/correct, preferences, privacy controls
- Resume API: size/MIME/magic-byte checks, PDF/DOCX text extraction, AI draft parsing, private storage upload, rate limit
- AI provider abstraction with Anthropic adapter
- Auth: Supabase email/password, session middleware, protected routes, safe redirects, callback route
- Postgres schema (Phase 1) with RLS, private resume bucket, onboarding RPC, jobs read model view
- Demo data: 14 fictional jobs across 11 industries, labeled everywhere; `supabase/seed.sql`
- Staff-only Mission Control at /admin/mission-control (founders and PATHD Team; everyone else is rerouted to their dashboard or home)
- Security fix: members can no longer change their own account_type
- GitHub-ready: Netlify config, Node version pin, CI workflow
- App shell: desktop nav, mobile bottom nav, skip link, demo banner, member Home, Profile

- Pay privacy: no current-pay collection, owner-only minimum pay, `pay_fit()` signal for employers (locked until Phase 6)

- Public explore screens with an app-style tab bar (phone) and tabs (computer): Map, Jobs, What's hot, Saved (hearts), Reset, Profile
- Header dropdown menus (Explore, Community, Fields); "No hidden pay" removed from the menu
- Commute map in the app: home, a place that matters, radius, layers, pin clustering, Zillow-style previews with workplace illustration and logo
- 32 sample jobs across 12 fields; Community page with circles, businesses and neighborhood board

- Portfolio portal: PDF uploads (25 MB, 10 files), per-file visibility, revocable share links, public viewer at /p/[token] (migration 0003)

- What's hot is now a community feed: events, good news, congrats, new in town, celebrations, game day, with cheers and RSVPs
- Project consolidated to 98 files so it uploads to GitHub in one go

- VYBR8-inspired screens: Charts, Milestone Perks, Link Up (fair-commute meeting spots), Pros and mentors, Hiring pop-ups, Add a workplace
- Installable app: manifest and home-screen icons from the new logo

- Nationwide city picker (all states + DC), map and distances follow the chosen city, nearby-city suggestions
- Work spots screen with featured laptop-friendly places and submissions for spots or workplaces

## In progress
- Field-level profile privacy for other viewers (currently whole-profile public/private; needs a `profiles_public` view)
- Account deletion and data export endpoints
- Automated accessibility audit (axe) and visual QA across devices

## Not started
- Phase 2–6 features (Map, Cloud, Swipe, Applications, Routes, Radar, Network, Circles, Reset, Local, portals, billing)
- Universal natural-language search
- Admin console and moderation

## Blocked / requires integration
- Portfolio uploads and share links: need Supabase, migration 0003 and SUPABASE_SERVICE_ROLE_KEY in Netlify
- Malware scanning for uploaded files: add a scanning service before public launch
- Real accounts and persistence: needs Supabase project keys
- Automatic resume reading: needs `ANTHROPIC_API_KEY` (manual entry works without it)
- Real job listings: needs an authorized job data provider or employer feeds
- Map: needs Mapbox token (Phase 2)
- Payments: needs Stripe (Phase 6)
- Email/push alerts: needs Resend and a push provider (Phase 3)
- Production rate limiting: needs Upstash/Redis (in-memory limiter is single-instance only)
