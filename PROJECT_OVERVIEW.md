# PATHD overview — 0.1.3 migration preview

PATHD remains an independent Next.js career website at mypathd.com, in vintagebyjaja/pathd-app. Its plum/cream interface, jobs, matching, profiles and portfolio workflows remain intact. Shared Supabase identity does not merge subscriptions, permissions, browser sessions or websites.

The companion experience offers exactly AELIO and MILA with separate histories. Server-side requests use the optional AELIO_PLATFORM service binding, or the fixed production AELIO HTTPS platform endpoint. This reuses the authenticated inference service without embedding the AELIO website. The AELIO Worker owns OpenAI credentials/provider configuration; PATHD never sends provider keys to the browser. Career import and sharing require consent.

Publishable and legacy anon public keys are supported; missing production configuration never creates a fictional authenticated member. Recovery enrollment and strong single-use codes use shared account metadata. Existing profile UUIDs and subscriptions are preserved.

The existing pathd-app Worker name, self-reference and pathd-opennext-cache binding are preserved from upstream main. No infrastructure is created by this update. See config/V0_1_2_SETUP.md for configuration and verification limits.

0.1.3 adds owner-scoped profile bootstrap, a clearly curated public MILA preview and saved real-user communication styles. Separate migration branch only; see config/V0_1_3_SETUP.md.


## 0.1.4 — Optional recovery and sign-in repair (2026-10-30)

Owner authorizes pushing this repair to main in each separate repository. Verified sign-in never forces recovery enrollment. Public browsing remains available; private account data still requires authentication. Signup no longer depends on optional companion/guest configuration. Saving recovery answers does not change passwords or sessions and preserves existing backup codes; new codes require explicit opt-in. Current-password verification remains required when editing security settings. Shared identities do not merge subscriptions or browser sessions.

Run AELIO migration `20261030000007_optional_recovery.sql` once after the already-applied 05 and 06 for answer-only saving. Do not rerun old migrations. Sign-in is independent of 07. No production SQL, credentials/settings changes or manual deployment performed. Local fixture checks do not verify production Auth or Cloudflare runtime configuration.
