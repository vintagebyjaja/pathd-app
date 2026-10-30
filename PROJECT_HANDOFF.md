# PATHD handoff

Correct source: vintagebyjaja/pathd-app. The earlier pathd-claude checkout was not used for delivery. Package version 0.1.0 → 0.1.1, combined delivery AELIO_v1.0.1, 2026-10-29. No deployment/push/publication/production SQL performed.

New components: src/components/companion (two-agent chat, shared security gate/setup, recovery, career context import, Ask MILA, reminder controls); private API relay at src/app/api/companion/[...path]; Cloudflare server binding adapter; same-domain callbacks; signup recovery/captcha integration; locally bundled original fonts. Existing jobs/matching/portfolio and brand remain intact. Anthropic resume parsing remains an existing server-only document tool, not an exposed third companion.

Verified locally: existing match tests (3), TypeScript, Next production build, Cloudflare OpenNext build. The combined AELIO suite tests real local PostgreSQL RLS, guest/thread/storage/reminder/recovery integration using explicit fake Auth/inference fixtures. Actual Supabase users, live Cloudflare binding/callbacks and real model output are unverified: no credentials were provided. No claim of a completed production migration or live SSO.

Required owner setup: exact NEXT_PUBLIC_* values (see .env.example), server-only keys where existing portfolio workflows need them, AELIO_PLATFORM binding to aelio-live, shared public/core API schemas and ordered AELIO migrations, existing account UUID bootstrap/mapping, CAPTCHA/rate limits before confirmation changes. Set wrangler.name to the actual existing PATHD Worker before manual rollout; do not create a duplicate application. Keep R2 application storage separate.

Existing signup identities must not be recreated. Recovery setup operates once against shared core metadata; it does not overwrite passwords, profiles, subscriptions or existing sessions. Unknown/uncertain service outcomes require retrying setup on the existing account, not another signup. Profile/Brain outages must be distinguished.

Next: follow the combined staging acceptance checklist with real authorized credentials, including two-domain login/recovery and RLS tests. Automatic job monitoring, passkeys, email/push notifications and automatic session SSO are not implemented. Native reminder drafting in AELIO uses user confirmation; PATHD exposes explicit reminder forms. No simulated AI is shown as real.
