# PATHD changes

## 0.1.3 — 2026-10-30 — migration preview

Decoupled successful Auth from private-core profile lookup using an idempotent owner-only RPC. Added six-style/three-topic curated MILA marketing preview and persistent real-chat style selection and the locked approved business-casual MILA portrait. Preserved independent site, subscriptions and exactly two companions. Fixed narrow-header overflow. Shared SQL 05/06 supplied in the separate AELIO package; no production actions performed. Main awaits explicit user review.

## 0.1.2 — 2026-10-30

Preserved separate PATHD site and upstream Cloudflare deployment configuration. Added safe Supabase public-key aliases and configuration errors, removed implicit production demo authentication, retained local-scope sessions, and added streaming AELIO/MILA responses with Stop, Retry and escaped Markdown. Incorporated previously local shared recovery/career/reminder integration. No new SQL or production configuration changes. See release manifest for validation and limits.

## 0.1.1 — 2026-10-29 — local candidate in AELIO_v1.0.1

Added native AELIO/MILA companions, private Brain service bridge, shared account/recovery enrollment, code/password-recovery screens, consent-based career import, Ask MILA entry points, reminder management/history and Cloudflare build configuration. Preserved distinct branding and existing career features. Bundled existing fonts locally and pinned compatible Cloudflare image dependencies. Paid plans remain closed. No production actions performed; real-service verification remains outstanding.

## 0.1.0

Existing repository baseline; earlier detailed release history was not independently verified.


## 0.1.4 — Optional recovery and sign-in repair (2026-10-30)

Owner authorizes pushing this repair to main in each separate repository. Verified sign-in never forces recovery enrollment. Public browsing remains available; private account data still requires authentication. Signup no longer depends on optional companion/guest configuration. Saving recovery answers does not change passwords or sessions and preserves existing backup codes; new codes require explicit opt-in. Current-password verification remains required when editing security settings. Shared identities do not merge subscriptions or browser sessions.

Run AELIO migration `20261030000007_optional_recovery.sql` once after the already-applied 05 and 06 for answer-only saving. Do not rerun old migrations. Sign-in is independent of 07. No production SQL, credentials/settings changes or manual deployment performed. Local fixture checks do not verify production Auth or Cloudflare runtime configuration.


## 0.1.5 — Migration review, not main (2026-10-30)

The owner requests migration-only review for this iteration. Preserve main at AELIO1.0.6 / PATHD0.1.4. No manual deployment, production SQL, secrets or settings changes. Accounts remain separate in each repository with shared Auth identities and independent subscriptions.

Account repair isolates optional legacy PATHD profile failures, preserves verified sessions and existing agent access, and removes guest-signing dependence from the global AI counter. Recovery questions are optional settings and absent from signup. Google/Apple PKCE and authenticated provider linking are wired; native Supabase passkey controls are default-off pending hosted-project/RP/recent-auth policy verification. Do not claim live OAuth/passkeys/production chat has been verified. The production outage's exact response/log is still needed.

AELIO09 SQL adds a private UUID-bound unlimited-credit registry; grants require the owner-verified IDs in config/GRANT_APPROVED_UNLIMITED.sql and confer no admin/Studio Brain/paid-plan permissions. Regular balances stay plan/product specific. Apply07 if needed, then08 and09 manually only after review; never rerun historical backfills. No real entitlement or production database was changed by Codex.

AELIO additionally includes bounded editable custom groups, the exact scripted UNCs marketing example, shared editorial styles and a reusable lazy page-aware DreamBox. These earlier requested features remain on migration. PATHD does not receive the AELIO group ecosystem or visual redesign. See AELIO config/V1_0_7_REVIEW_SETUP.md and release validation notes for manual setup and limitations.


Backend-priority follow-up: UI refinement/resizable workspace is deferred. Added correlated reservation/provider/persistence diagnostics and copyable support references, fixed fragmented CRLF stream parsing and deterministic ordering for newly saved chat turns (SQL10). All eight companion handler/provider/persistence paths are tested with explicitly synthetic local inference; Simone provider rejection is correlated/refunded. Production outage remains unverified: no Cloudflare runtime-log connection or live provider credentials were available. New work stays migration-only; no main push, production SQL or manual deployment.
