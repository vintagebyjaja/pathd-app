# PATHD 0.1.2 release manifest

Independent repository: vintagebyjaja/pathd-app. Separate site: mypathd.com. Incorporates the previous local companion candidate and preserves upstream deployment fixes from 077eb72. No new SQL, no file deletions, no credentials or dependencies/build caches delivered. Existing shared platform migrations remain prerequisites.

Validation: 7 Vitest tests passed (3 matching, 4 public auth configuration); TypeScript passed. Next production and Cloudflare OpenNext builds passed using OpenNext 1.20.14 / Wrangler 4.156.0. Standalone lint cannot run noninteractively because the repository has no ESLint configuration; next lint opens its setup prompt. Live Supabase/provider/deployment checks are unverified.

Streaming transport and persistence use the separately tested AELIO gateway. PATHD browser end-to-end authentication and real model output have not been verified with production credentials. Stopped partial replies are local; completed replies persist. No production database/settings/secrets were changed and no deployment command was run.

Changed or added project files relative to upstream main:

- `.env.example`
- `.gitignore`
- `AGENTS.md`
- `CHANGELOG.md`
- `PROJECT_HANDOFF.md`
- `PROJECT_OVERVIEW.md`
- `README.md`
- `RELEASE_MANIFEST.md`
- `config/V0_1_2_SETUP.md`
- `package-lock.json`
- `package.json`
- `scripts/check-auth-env.mjs`
- `src/app/(app)/companion/page.tsx`
- `src/app/(app)/jobs/[id]/page.tsx`
- `src/app/(app)/layout.tsx`
- `src/app/(app)/settings/security/page.tsx`
- `src/app/(auth)/AuthForm.tsx`
- `src/app/(auth)/Captcha.tsx`
- `src/app/(auth)/actions.ts`
- `src/app/(auth)/forgot-password/page.tsx`
- `src/app/(auth)/reset-password/page.tsx`
- `src/app/(marketing)/page.tsx`
- `src/app/api/companion/[...path]/route.ts`
- `src/app/auth/callback/route.ts`
- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/components/companion/AskMila.tsx`
- `src/components/companion/CareerTools.tsx`
- `src/components/companion/Companions.tsx`
- `src/components/companion/ImportCareer.tsx`
- `src/components/companion/Markdown.tsx`
- `src/components/companion/RecoveryForm.tsx`
- `src/components/companion/SecurityGate.tsx`
- `src/components/companion/SecuritySetup.tsx`
- `src/components/layout/AppNav.tsx`
- `src/components/marketing/sections.tsx`
- `src/lib/companion/server.ts`
- `src/lib/data/member.ts`
- `src/lib/env.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/config.test.ts`
- `src/lib/supabase/config.ts`
- `src/lib/supabase/server.ts`
- `src/middleware.ts`
- `wrangler.jsonc`
