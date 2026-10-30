# PATHD 0.1.2 handoff — 2026-10-30

Repository: vintagebyjaja/pathd-app, independent of AELIO. This release incorporates the earlier local companion/recovery candidate and preserves upstream main 077eb72 deployment fixes. No PATHD source is delivered inside AELIO.

Added publishable-key compatibility, safe missing-config handling, distinct authentication errors, local-scope logout, streaming companion responses, immediate message acknowledgement, Stop/Retry, escaped Markdown and request replay protection via the existing shared platform. Exactly AELIO and MILA remain available; no marketplace/custom agents. Existing branding and career features are retained.

OpenNext uses the existing pathd-app Worker/self-reference and its separate cache bucket. The optional private AELIO_PLATFORM binding is preferred; production otherwise calls the fixed AELIO HTTPS endpoint server-side with the authenticated user's token. Local development requires an explicit loopback origin and never silently sends test traffic to production.

Real Supabase login, provider inference, callbacks and Cloudflare deployment remain unverified in this environment: production credentials are not available and live site requests are blocked by network policy. No production SQL, secrets or settings were changed. Existing shared platform migrations remain prerequisites; no new SQL is introduced here. See config/V0_1_2_SETUP.md and RELEASE_MANIFEST.md for checks and setup.

Stopped partial replies are local and may disappear on reload; only completed turns persist. Advanced external account linking, job monitoring, passkeys and notification delivery are not implemented. Do not label them operational.
