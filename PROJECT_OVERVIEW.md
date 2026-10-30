# PATHD overview — 0.1.3 migration preview

PATHD remains an independent Next.js career website at mypathd.com, in vintagebyjaja/pathd-app. Its plum/cream interface, jobs, matching, profiles and portfolio workflows remain intact. Shared Supabase identity does not merge subscriptions, permissions, browser sessions or websites.

The companion experience offers exactly AELIO and MILA with separate histories. Server-side requests use the optional AELIO_PLATFORM service binding, or the fixed production AELIO HTTPS platform endpoint. This reuses the authenticated inference service without embedding the AELIO website. The AELIO Worker owns OpenAI credentials/provider configuration; PATHD never sends provider keys to the browser. Career import and sharing require consent.

Publishable and legacy anon public keys are supported; missing production configuration never creates a fictional authenticated member. Recovery enrollment and strong single-use codes use shared account metadata. Existing profile UUIDs and subscriptions are preserved.

The existing pathd-app Worker name, self-reference and pathd-opennext-cache binding are preserved from upstream main. No infrastructure is created by this update. See config/V0_1_2_SETUP.md for configuration and verification limits.

0.1.3 adds owner-scoped profile bootstrap, a clearly curated public MILA preview and saved real-user communication styles. Separate migration branch only; see config/V0_1_3_SETUP.md.
