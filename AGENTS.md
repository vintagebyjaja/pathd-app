# PATHD coding instructions

Read PROJECT_OVERVIEW.md and PROJECT_HANDOFF.md. Preserve PATHD's existing plum/cream identity and unrelated features. Work in the existing isolated checkout; no worktrees unless requested.

Do not deploy, publish, push or run production SQL without a new explicit instruction. Shared Supabase identity does not share browser sessions or subscription entitlements. Preserve existing UUIDs/profiles and application data. Do not create a second project, duplicate accounts or touch unrelated applications' Firebase configuration.

PATHD offers exactly two companions: AELIO (adaptive Original Main Pal) and MILA (distinct career/life companion). No custom agents, marketplace or personality selector in PATHD. All inference goes through the authenticated AELIO platform gateway, using its optional private binding or fixed server-side production HTTPS fallback. Keep contexts separate; career import and outside-MILA sharing require consent. Never claim reminders/job monitoring are operational without confirmed persistence/delivery/provider evidence.

Keys prefixed NEXT_PUBLIC_ must be client-safe. Service-role credentials remain server-only. Recovery questions never authorize resets without a strong credential. Keep signup CAPTCHA/rate-limit settings aligned with the shared Auth project; do not change project-wide email-confirmation settings automatically.

Maintain documentation/version history. The user now authorizes validated Git pushes to this separate repository; no manual deployment or production configuration changes. Test/build locally and report real-service blockers honestly. No raw Auth tokens in URLs.

## 0.1.3 review boundary

The latest user requests a migration-branch preview and will approve main later. Push only migration; preserve main and all production configuration. MILA has six communication styles, not six agents. The public preview is curated and labeled, never live inference.
