# PATHD overview — local delivery 0.1.1 / AELIO_v1.0.1

Next.js 15 / React / Supabase career platform with existing jobs, matching, profiles and portfolio workflows. Existing branding is preserved. Figtree and Marcellus are now bundled locally to preserve typography without build-time Google Fonts access.

New `/companion` offers AELIO and MILA only. Both use AELIO's existing private inference gateway via the AELIO_PLATFORM Cloudflare service binding. AELIO and MILA histories remain separate and product-scoped. Career profile import is explicit and owner-authorized. Job pages support Ask MILA; reminder CRUD and in-app history use the shared service. No job-monitoring provider is active.

One shared Supabase project at xkpzabgpesishxcluxkp.supabase.co, shared core identity/recovery, independent memberships/plans/credits. Existing public PATHD tables are reused; AELIO's ordered migrations preserve PATHD profile provisioning. No second identity database. Independent domain sign-in uses the same credentials; automatic cross-domain session SSO is not implemented.

`/settings/security` provides one-time shared recovery enrollment and later reauthenticated updates. Strong single-use recovery codes supplement salted slow-hashed answers. `/forgot-password` supports on-site code recovery and secure email fallback. Paid plans remain Coming Soon.

Cloudflare source/build integration is supplied in open-next.config.ts and wrangler.jsonc. The actual existing PATHD Worker name must be checked before the owner uses the template. No deployment or production configuration has been changed. Refer to the combined delivery's AELIO/config/SETUP.md and SQL instructions for prerequisites and staging acceptance.
