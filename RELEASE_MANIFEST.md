# PATHD 0.1.3 migration review manifest

Repository: vintagebyjaja/pathd-app. Branch: migration. Base/main: 55a5f26. Main requires later explicit approval. Separate from AELIO; no other site repository was modified.

Features: owner-scoped shared profile bootstrap with successful Auth independent of private-schema access, idempotent missing-record setup, six-style/three-topic curated MILA marketing preview, saved real-chat communication preference, immutable approved business-casual MILA portrait in marketing/companion/message avatars, and narrow-header overflow correction. Original branding, navigation, careers, two-companion restriction and independent subscriptions remain intact.

Validation: 12 Vitest tests, standalone TypeScript, Next production build and Cloudflare OpenNext build passed. Public preview browser checks pass all eighteen curated samples at 1440/390/320px, real signup CTA, no AI calls, reduced motion and no overflow. Standalone next lint lacks project configuration and opens setup; not claimed as passed. Live Supabase/users/model output/runtime bindings remain unverified. No production settings/SQL/secrets or manual deployment changed.

Shared SQL 05/06 is supplied separately in the AELIO migration branch/package and must be reviewed/applied once to the existing shared project. No second project/database or duplicate profiles. No new PATHD_SESSION_SECRET is required. No file deletions. Rebuild with npm run build:cloudflare after owner approval; do not run deployment commands automatically.

## Changed or added files

- `AGENTS.md`
- `CHANGELOG.md`
- `PROJECT_HANDOFF.md`
- `PROJECT_OVERVIEW.md`
- `README.md`
- `RELEASE_MANIFEST.md`
- `config/V0_1_3_SETUP.md`
- `docs/previews/v0.1.3/README.md`
- `docs/previews/v0.1.3/mila-1440.png`
- `docs/previews/v0.1.3/mila-320.png`
- `docs/previews/v0.1.3/mila-390.png`
- `package-lock.json`
- `package.json`
- `public/companions/mila.webp`
- `scripts/check-auth-env.mjs`
- `scripts/checks/browser_mila.py`
- `src/app/(auth)/actions.ts`
- `src/app/(marketing)/page.tsx`
- `src/app/globals.css`
- `src/components/companion/Companions.tsx`
- `src/components/companion/MilaAvatar.tsx`
- `src/components/companion/SecurityGate.tsx`
- `src/components/marketing/MilaPreview.tsx`
- `src/components/marketing/SiteHeader.tsx`
- `src/lib/companion/auth-repair.test.ts`
- `src/lib/companion/mila-preview.test.ts`
- `src/lib/companion/mila-preview.ts`
- `src/lib/data/member.ts`
- `src/lib/supabase/config.ts`


## 0.1.4 — Optional recovery and sign-in repair (2026-10-30)

Owner authorizes pushing this repair to main in each separate repository. Verified sign-in never forces recovery enrollment. Public browsing remains available; private account data still requires authentication. Signup no longer depends on optional companion/guest configuration. Saving recovery answers does not change passwords or sessions and preserves existing backup codes; new codes require explicit opt-in. Current-password verification remains required when editing security settings. Shared identities do not merge subscriptions or browser sessions.

Run AELIO migration `20261030000007_optional_recovery.sql` once after the already-applied 05 and 06 for answer-only saving. Do not rerun old migrations. Sign-in is independent of 07. No production SQL, credentials/settings changes or manual deployment performed. Local fixture checks do not verify production Auth or Cloudflare runtime configuration.
