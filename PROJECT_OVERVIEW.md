# Current review — PATHD0.1.6 (2026-10-30)

The current user authorized remaining pricing/access changes and migration-only pushes with visual review. Pro is$16/month; annual prices and all other monthly prices remain unchanged. Paid AELIO unlocks AELIO/MILA on PATHD using its own allowance, with PATHD+ and Pro career permissions remaining independent. Paid enrollment is not activated. Review docs/releases/PATHD_v0.1.6_REVIEW.md and docs/previews/v0.1.6/README.md. Shared SQL13 lives only in AELIO and requires manual owner application after the reported11/12. Main and production settings remain unchanged. Historical records follow.

---

# PATHD overview — 0.1.3 migration preview

PATHD remains an independent Next.js career website at mypathd.com, in vintagebyjaja/pathd-app. Its plum/cream interface, jobs, matching, profiles and portfolio workflows remain intact. Shared Supabase identity does not merge subscriptions, permissions, browser sessions or websites.

The companion experience offers exactly AELIO and MILA with separate histories. Server-side requests use the optional AELIO_PLATFORM service binding, or the fixed production AELIO HTTPS platform endpoint. This reuses the authenticated inference service without embedding the AELIO website. The AELIO Worker owns OpenAI credentials/provider configuration; PATHD never sends provider keys to the browser. Career import and sharing require consent.

Publishable and legacy anon public keys are supported; missing production configuration never creates a fictional authenticated member. Recovery enrollment and strong single-use codes use shared account metadata. Existing profile UUIDs and subscriptions are preserved.

The existing pathd-app Worker name, self-reference and pathd-opennext-cache binding are preserved from upstream main. No infrastructure is created by this update. See config/V0_1_2_SETUP.md for configuration and verification limits.

0.1.3 adds owner-scoped profile bootstrap, a clearly curated public MILA preview and saved real-user communication styles. Separate migration branch only; see config/V0_1_3_SETUP.md.


## 0.1.4 — Optional recovery and sign-in repair (2026-10-30)

Owner authorizes pushing this repair to main in each separate repository. Verified sign-in never forces recovery enrollment. Public browsing remains available; private account data still requires authentication. Signup no longer depends on optional companion/guest configuration. Saving recovery answers does not change passwords or sessions and preserves existing backup codes; new codes require explicit opt-in. Current-password verification remains required when editing security settings. Shared identities do not merge subscriptions or browser sessions.

Run AELIO migration `20261030000007_optional_recovery.sql` once after the already-applied 05 and 06 for answer-only saving. Do not rerun old migrations. Sign-in is independent of 07. No production SQL, credentials/settings changes or manual deployment performed. Local fixture checks do not verify production Auth or Cloudflare runtime configuration.


## 0.1.5 — Migration review, not main (2026-10-30)

The owner requests migration-only review for this iteration. Preserve main at AELIO1.0.6 / PATHD0.1.4. No manual deployment, production SQL, secrets or settings changes. Accounts remain separate in each repository with shared Auth identities and independent subscriptions.

Account repair isolates optional legacy PATHD profile failures, preserves verified sessions and existing agent access, and removes guest-signing dependence from the global AI counter. Recovery questions are optional settings and absent from signup. Google/Apple PKCE and authenticated provider linking are wired; native Supabase passkey controls are default-off pending hosted-project/RP/recent-auth policy verification. Do not claim live OAuth/passkeys/production chat has been verified. The production outage's exact response/log is still needed.

AELIO09 SQL adds a private UUID-bound unlimited-credit registry; grants require the owner-verified IDs in config/GRANT_APPROVED_UNLIMITED.sql and confer no admin/Studio Brain/paid-plan permissions. Regular balances stay plan/product specific. Apply07 if needed, then08 and09 manually only after review; never rerun historical backfills. No real entitlement or production database was changed by Codex.

AELIO additionally includes bounded editable custom groups, the exact scripted UNCs marketing example, shared editorial styles and a reusable lazy page-aware DreamBox. These earlier requested features remain on migration. PATHD does not receive the AELIO group ecosystem or visual redesign. See AELIO config/V1_0_7_REVIEW_SETUP.md and release validation notes for manual setup and limitations.
