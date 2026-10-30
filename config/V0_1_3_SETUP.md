# PATHD 0.1.3 — independent migration preview

Branch migration, base main 55a5f26. Main must remain unchanged until the user approves. No manual Cloudflare deployment or production SQL/settings/secrets changes.

Login verifies Supabase Auth independently. Owner-scoped public app_account_bootstrap repairs missing shared/product rows without replacing UUIDs, profiles, sessions or subscriptions. A private-schema lookup failure no longer turns a successful login into an error. The security gate checks the same RPC; dashboard access remains truthful when its status cannot be loaded. Sensitive recovery actions still enforce their own checks.

Shared database prerequisite: review/apply AELIO migrations 20261030000005_account_repair.sql then 20261030000006_permanent_companions.sql after existing 01–04. Apply only once to the shared project, never a second database. SQL is in the separate AELIO migration branch/package; no PATHD source is combined with AELIO. PATHD itself still exposes exactly AELIO/MILA, with independent product histories and entitlements. The shared database may store AELIO’s other companions, but PATHD never lists or routes to them.

No PATHD_SESSION_SECRET is required by this implementation. Existing NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY), NEXT_PUBLIC_SITE_URL=https://mypathd.com, and optional TURNSTILE configuration remain. Privileged keys stay server-only. New public API keys are never used as server Bearer JWTs. Existing pathd-app Worker/self/cache bindings remain unchanged.

The public MEET MILA preview is explicitly prewritten: six styles × three topics, no inference calls. Signed-in users choose MILA style in the real companion screen; the preference is saved in app_preferences.mila_style and supplied only to MILA through the existing AELIO server gateway. The CTA verifies a session before routing to MILA; guests go to signup. The gateway still uses AELIO’s configured provider secret; an independent PATHD OpenAI key is not sent to browsers or used to create a duplicate AI platform.

Local production builds, tests and curated-preview checks do not verify live Supabase users, redirects, inference or Cloudflare runtime secrets. After owner-managed rollout, verify both domains independently, shared recovery enrollment, actual dashboard/profile persistence, style changes without history resets, two-companion filtering, streaming/Stop/Retry and cross-user isolation. No automatic cross-domain login-cookie sharing or subscription merging is introduced.

MILA’s official portrait is public/companions/mila.webp, copied byte-for-byte from the approved AELIO import. No user avatar preference can override it. Only deliberate reviewed application updates may replace the official asset.
