## Main promotion authorized — 2026-10-31

The owner explicitly approved pushing the reviewed AELIO 1.0.10 and PATHD 0.1.6 changes to their respective main branches. This supersedes earlier no-push review boundaries for those completed updates only. Normal Git-triggered builds may run; no manual deployment, production SQL, secrets or settings changes are authorized. Owner reports shared SQL13 applied. AUREVIA is a new, separate phased integration on local migration for review; do not push that new work or merge it into main without approval. Preserve approved homepage and portraits. Existing hosted integration limits remain documented; local tests do not prove production Auth/inference.

---

# Review manifest — PATHD0.1.6 (2026-10-30)

The current user authorized remaining pricing/access changes and migration-only pushes with visual review. Pro is$16/month; annual prices and all other monthly prices remain unchanged. Paid AELIO unlocks AELIO/MILA on PATHD using its own allowance, with PATHD+ and Pro career permissions remaining independent. Paid enrollment is not activated. Review docs/releases/PATHD_v0.1.6_REVIEW.md and docs/previews/v0.1.6/README.md. Shared SQL13 lives only in AELIO and requires manual owner application after the reported11/12. Main and production settings remain unchanged. Historical records follow.

---

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


## 0.1.5 — Migration review, not main (2026-10-30)

The owner requests migration-only review for this iteration. Preserve main at AELIO1.0.6 / PATHD0.1.4. No manual deployment, production SQL, secrets or settings changes. Accounts remain separate in each repository with shared Auth identities and independent subscriptions.

Account repair isolates optional legacy PATHD profile failures, preserves verified sessions and existing agent access, and removes guest-signing dependence from the global AI counter. Recovery questions are optional settings and absent from signup. Google/Apple PKCE and authenticated provider linking are wired; native Supabase passkey controls are default-off pending hosted-project/RP/recent-auth policy verification. Do not claim live OAuth/passkeys/production chat has been verified. The production outage's exact response/log is still needed.

AELIO09 SQL adds a private UUID-bound unlimited-credit registry; grants require the owner-verified IDs in config/GRANT_APPROVED_UNLIMITED.sql and confer no admin/Studio Brain/paid-plan permissions. Regular balances stay plan/product specific. Apply07 if needed, then08 and09 manually only after review; never rerun historical backfills. No real entitlement or production database was changed by Codex.

AELIO additionally includes bounded editable custom groups, the exact scripted UNCs marketing example, shared editorial styles and a reusable lazy page-aware DreamBox. These earlier requested features remain on migration. PATHD does not receive the AELIO group ecosystem or visual redesign. See AELIO config/V1_0_7_REVIEW_SETUP.md and release validation notes for manual setup and limitations.


Backend-priority follow-up: UI refinement/resizable workspace is deferred. Added correlated reservation/provider/persistence diagnostics and copyable support references, fixed fragmented CRLF stream parsing and deterministic ordering for newly saved chat turns (SQL10). All eight companion handler/provider/persistence paths are tested with explicitly synthetic local inference; Simone provider rejection is correlated/refunded. Production outage remains unverified: no Cloudflare runtime-log connection or live provider credentials were available. New work stays migration-only; no main push, production SQL or manual deployment.
