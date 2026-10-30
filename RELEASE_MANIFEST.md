# AELIO_v1.0.1 complete repository inventory

Repository: PATHD. Local candidate, not deployed/published. The GitHub parts together contain the COMPLETE AELIO and PATHD projects, not just changed files.

The baseline was unversioned at AELIO platform level. PATHD is package 0.1.1. Extract all parts together, then upload each project directory to its separate repository. Dependencies, build caches, credentials and temporary/data files are excluded. public/ is required committed AELIO deployment output.

## Remove obsolete destination files

None.

## Changed/added/removed paths

```text
 M README.md
 M package.json
 M src/app/(app)/jobs/[id]/page.tsx
 M src/app/(app)/layout.tsx
 M src/app/(auth)/AuthForm.tsx
 M src/app/(auth)/actions.ts
 M src/app/(marketing)/page.tsx
 M src/app/auth/callback/route.ts
 M src/app/layout.tsx
 M src/components/layout/AppNav.tsx
 M src/components/marketing/sections.tsx
 M src/middleware.ts
?? .env.example
?? .gitignore
?? AGENTS.md
?? CHANGELOG.md
?? PROJECT_HANDOFF.md
?? PROJECT_OVERVIEW.md
?? open-next.config.ts
?? package-lock.json
?? src/app/(app)/companion/
?? src/app/(app)/settings/
?? src/app/(auth)/Captcha.tsx
?? src/app/(auth)/forgot-password/
?? src/app/(auth)/reset-password/
?? src/app/api/companion/
?? src/components/companion/
?? src/lib/companion/
?? wrangler.jsonc
```

## Complete file inventory

- .env.example
- .gitignore
- AGENTS.md
- CHANGELOG.md
- IMPLEMENTATION_STATUS.md
- PRODUCT_SPEC.md
- PROJECT_HANDOFF.md
- PROJECT_OVERVIEW.md
- README.md
- RELEASE_MANIFEST.md
- netlify.toml
- next.config.ts
- open-next.config.ts
- package-lock.json
- package.json
- postcss.config.mjs
- public/apple-touch-icon.png
- public/brand/pathd-logo.png
- public/icon-192.png
- public/icon-512.png
- src/app/(app)/[section]/page.tsx
- src/app/(app)/companion/page.tsx
- src/app/(app)/home/page.tsx
- src/app/(app)/jobs/[id]/page.tsx
- src/app/(app)/jobs/page.tsx
- src/app/(app)/layout.tsx
- src/app/(app)/map/page.tsx
- src/app/(app)/profile/page.tsx
- src/app/(app)/settings/security/page.tsx
- src/app/(auth)/AuthForm.tsx
- src/app/(auth)/Captcha.tsx
- src/app/(auth)/actions.ts
- src/app/(auth)/forgot-password/page.tsx
- src/app/(auth)/layout.tsx
- src/app/(auth)/reset-password/page.tsx
- src/app/(auth)/sign-in/page.tsx
- src/app/(auth)/sign-up/page.tsx
- src/app/(marketing)/community/page.tsx
- src/app/(marketing)/explore/[screen]/page.tsx
- src/app/(marketing)/explore/layout.tsx
- src/app/(marketing)/explore/page.tsx
- src/app/(marketing)/layout.tsx
- src/app/(marketing)/legal/privacy/page.tsx
- src/app/(marketing)/legal/terms/page.tsx
- src/app/(marketing)/page.tsx
- src/app/(marketing)/pricing/page.tsx
- src/app/admin/layout.tsx
- src/app/admin/mission-control/page.tsx
- src/app/api/companion/[...path]/route.ts
- src/app/api/portfolio/[id]/finalize/route.ts
- src/app/api/portfolio/[id]/route.ts
- src/app/api/portfolio/[id]/share/route.ts
- src/app/api/portfolio/upload-url/route.ts
- src/app/api/resume/parse/route.ts
- src/app/auth/callback/route.ts
- src/app/globals.css
- src/app/layout.tsx
- src/app/manifest.ts
- src/app/not-found.tsx
- src/app/onboarding/actions.ts
- src/app/onboarding/page.tsx
- src/app/p/[token]/page.tsx
- src/components/admin/Reroute.tsx
- src/components/brand/Logo.tsx
- src/components/companion/AskMila.tsx
- src/components/companion/CareerTools.tsx
- src/components/companion/Companions.tsx
- src/components/companion/ImportCareer.tsx
- src/components/companion/RecoveryForm.tsx
- src/components/companion/SecurityGate.tsx
- src/components/companion/SecuritySetup.tsx
- src/components/explore/ExploreProvider.tsx
- src/components/explore/ExploreTabs.tsx
- src/components/explore/MapExplorer.tsx
- src/components/explore/more.tsx
- src/components/explore/parts.tsx
- src/components/explore/screens.tsx
- src/components/jobs/JobCard.tsx
- src/components/jobs/JobFilters.tsx
- src/components/layout/AppNav.tsx
- src/components/marketing/HeroRoutes.tsx
- src/components/marketing/SiteHeader.tsx
- src/components/marketing/sections.tsx
- src/components/onboarding/OnboardingFlow.tsx
- src/components/profile/PortfolioManager.tsx
- src/components/ui/Button.tsx
- src/lib/admin/staff.ts
- src/lib/ai/index.ts
- src/lib/ai/provider.ts
- src/lib/companion/server.ts
- src/lib/data/demo/jobs.ts
- src/lib/data/demo/profile.ts
- src/lib/data/jobs-repository.ts
- src/lib/data/member.ts
- src/lib/env.ts
- src/lib/explore/cities.ts
- src/lib/explore/fields.ts
- src/lib/explore/jobs.ts
- src/lib/explore/samples.ts
- src/lib/explore/scenes.ts
- src/lib/geo/distance.ts
- src/lib/match/score.test.ts
- src/lib/match/score.ts
- src/lib/portfolio/server.ts
- src/lib/portfolio/types.ts
- src/lib/rate-limit.ts
- src/lib/resume/extract-text.ts
- src/lib/salary/format.ts
- src/lib/supabase/browser.ts
- src/lib/supabase/server.ts
- src/middleware.ts
- src/types/domain.ts
- supabase/migrations/0001_phase1.sql
- supabase/migrations/0002_staff_access.sql
- supabase/migrations/0003_portfolios.sql
- supabase/seed.sql
- tsconfig.json
- vitest.config.ts
- wrangler.jsonc

Every packaged file has a SHA-256 in the external FILE_MANIFEST.json and per-part manifest. ZIP hashes are in SHA256SUMS.txt. This document is included; its hash is calculated by the packaging tool after generation.
