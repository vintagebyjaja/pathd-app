# Main promotion approved — 2026-10-30

The user approved promoting reviewed PATHD 0.1.3 to main, independently of AELIO. Reviewed application commit: 7c1308c. This promotion adds documentation only; application contents are unchanged. Existing Git-triggered Cloudflare builds are permitted, but no manual deployment, production SQL/settings/secrets were changed. The owner retrieves/applies shared SQL once from AELIO's package.

---

# PATHD 0.1.3 migration preview — 2026-10-30

Review branch migration, based on main 55a5f26. User approval is required before a later main push. No manual deployment, production SQL, settings or secrets changed.

Login now uses a public owner-only bootstrap RPC instead of direct core schema access. Auth success is separate from profile service availability; missing rows are initialized without overwrites. Existing sessions/users/subscriptions remain distinct from AELIO. PATHD retains only AELIO and MILA, even though the shared AELIO database now supports eight official companions. Shared SQL 05/06 must be reviewed/applied once from the AELIO package.

MEET MILA stays inside the original purple section: six style selectors, three topics and eighteen curated examples, labeled demonstration with no AI calls. An authenticated visitor’s CTA goes to MILA; guests go to signup. Real users save MILA style to shared preferences; the AELIO gateway applies it without changing identity/history. A narrow 320px header spacing fix prevents overflow while preserving navigation and branding.

See config/V0_1_3_SETUP.md and RELEASE_MANIFEST.md. Real production Auth/model responses and runtime configuration were unavailable locally, so do not claim live repair or deployment verification.

---

# PATHD 0.1.2 handoff — 2026-10-30

Repository: vintagebyjaja/pathd-app, independent of AELIO. This release incorporates the earlier local companion/recovery candidate and preserves upstream main 077eb72 deployment fixes. No PATHD source is delivered inside AELIO.

Added publishable-key compatibility, safe missing-config handling, distinct authentication errors, local-scope logout, streaming companion responses, immediate message acknowledgement, Stop/Retry, escaped Markdown and request replay protection via the existing shared platform. Exactly AELIO and MILA remain available; no marketplace/custom agents. Existing branding and career features are retained.

OpenNext uses the existing pathd-app Worker/self-reference and its separate cache bucket. The optional private AELIO_PLATFORM binding is preferred; production otherwise calls the fixed AELIO HTTPS endpoint server-side with the authenticated user's token. Local development requires an explicit loopback origin and never silently sends test traffic to production.

Real Supabase login, provider inference, callbacks and Cloudflare deployment remain unverified in this environment: production credentials are not available and live site requests are blocked by network policy. No production SQL, secrets or settings were changed. Existing shared platform migrations remain prerequisites; no new SQL is introduced here. See config/V0_1_2_SETUP.md and RELEASE_MANIFEST.md for checks and setup.

Stopped partial replies are local and may disappear on reload; only completed turns persist. Advanced external account linking, job monitoring, passkeys and notification delivery are not implemented. Do not label them operational.

Official portrait update: the approved business-casual MILA source is optimized as the exact same WebP bytes used in AELIO. MilaAvatar has no user-editable URL or upload setting. Marketing, companion selection and message avatars use that protected asset.


## 0.1.4 — Optional recovery and sign-in repair (2026-10-30)

Owner authorizes pushing this repair to main in each separate repository. Verified sign-in never forces recovery enrollment. Public browsing remains available; private account data still requires authentication. Signup no longer depends on optional companion/guest configuration. Saving recovery answers does not change passwords or sessions and preserves existing backup codes; new codes require explicit opt-in. Current-password verification remains required when editing security settings. Shared identities do not merge subscriptions or browser sessions.

Run AELIO migration `20261030000007_optional_recovery.sql` once after the already-applied 05 and 06 for answer-only saving. Do not rerun old migrations. Sign-in is independent of 07. No production SQL, credentials/settings changes or manual deployment performed. Local fixture checks do not verify production Auth or Cloudflare runtime configuration.
