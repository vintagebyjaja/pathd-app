# PATHD coding instructions

Read PROJECT_OVERVIEW.md and PROJECT_HANDOFF.md. Preserve PATHD's existing plum/cream identity and unrelated features. Work in the existing isolated checkout; no worktrees unless requested.

Do not deploy, publish, push or run production SQL without a new explicit instruction. Shared Supabase identity does not share browser sessions or subscription entitlements. Preserve existing UUIDs/profiles and application data. Do not create a second project, duplicate accounts or touch unrelated applications' Firebase configuration.

PATHD offers exactly two companions: AELIO (adaptive Original Main Pal) and MILA (distinct career/life companion). No custom agents, marketplace or personality selector in PATHD. All inference goes through the authenticated AELIO platform gateway, using its optional private binding or fixed server-side production HTTPS fallback. Keep contexts separate; career import and outside-MILA sharing require consent. Never claim reminders/job monitoring are operational without confirmed persistence/delivery/provider evidence.

Keys prefixed NEXT_PUBLIC_ must be client-safe. Service-role credentials remain server-only. Recovery questions never authorize resets without a strong credential. Keep signup CAPTCHA/rate-limit settings aligned with the shared Auth project; do not change project-wide email-confirmation settings automatically.

Maintain documentation/version history. The user now authorizes validated Git pushes to this separate repository; no manual deployment or production configuration changes. Test/build locally and report real-service blockers honestly. No raw Auth tokens in URLs.

## 0.1.3 review boundary

The latest user requests a migration-branch preview and will approve main later. Push only migration; preserve main and all production configuration. MILA has six communication styles, not six agents. The public preview is curated and labeled, never live inference.

## Main promotion approved — 2026-10-30

The user explicitly approved pushing the reviewed migration update to main, separately from AELIO. Git-triggered Cloudflare builds are permitted. No manual deployment, production SQL, settings or secret changes are authorized. The owner will run the shared Supabase SQL personally.


## 0.1.4 — Optional recovery and sign-in repair (2026-10-30)

Owner authorizes pushing this repair to main in each separate repository. Verified sign-in never forces recovery enrollment. Public browsing remains available; private account data still requires authentication. Signup no longer depends on optional companion/guest configuration. Saving recovery answers does not change passwords or sessions and preserves existing backup codes; new codes require explicit opt-in. Current-password verification remains required when editing security settings. Shared identities do not merge subscriptions or browser sessions.

Run AELIO migration `20261030000007_optional_recovery.sql` once after the already-applied 05 and 06 for answer-only saving. Do not rerun old migrations. Sign-in is independent of 07. No production SQL, credentials/settings changes or manual deployment performed. Local fixture checks do not verify production Auth or Cloudflare runtime configuration.

## 0.1.5 migration review

The latest owner instruction returns to migration-only review. Do not push this iteration to main or deploy. Shared account/profile resilience, optional recovery, Google/Apple linking, and native passkey code are the scope; do not import AELIO's visual/group ecosystem into PATHD. Passkeys remain default-off pending hosted Auth/RP/recent-auth policy verification. Credit grants live in the shared AELIO SQL registry, bind verified UUIDs and confer no admin or paid subscription. No production SQL/settings/secrets changes.


Latest priority is shared backend outage investigation, not visual work. Keep migration-only. AELIO SQL10 fixes newly saved turn ordering; no production SQL is authorized. Live inference/runtime-log access is unavailable, so local synthetic pipeline tests do not establish production recovery.


## Current0.1.6 remaining-handoff review — 2026-10-30

Current user authorizes migration-branch pushes and visual previews, never main until approval. Monthly Pro is$16; preserve annual prices and every other monthly price. Active paid AELIO may fund AELIO/MILA in PATHD without upgrading PATHD community/career plans; otherwise eligible paid PATHD funds companions. Free core applications, browsing, resumes, maps and discovery stay free. The server gateway and SQL13 enforce access and one funding source. Shared allowance policy is now explicitly60% with a $10 minimum for eligible paid AI plans. No production SQL/settings/secrets changes are authorized. Shared migration13 is owner-applied only in AELIO, never duplicated here. See docs/releases/PATHD_v0.1.6_REVIEW.md; preserve middleware Auth. The local static fixture harness is not an application route or proof of actual paid access.
