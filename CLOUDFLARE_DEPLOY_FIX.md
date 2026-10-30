# Cloudflare Worker deployment fix

The old deployment error 10143 referenced a nonexistent Worker `pathd` through `WORKER_SELF_REFERENCE`. The `wrangler.jsonc` in this package uses `pathd-app` for both the deployment name and the self-reference binding.

Cloudflare build command: `npx @opennextjs/cloudflare build`
Cloudflare deploy command: `npx wrangler deploy`

Ensure the R2 bucket `pathd-opennext-cache` exists in the same Cloudflare account. If your previous Cloudflare setup auto-generates wrangler files or overrides the binding, remove the conflicting override. Keep existing Supabase environment variables and any other secrets in Cloudflare settings, not this ZIP.

This change addresses the observed Wrangler binding error, not unrelated runtime issues. Validate in a test deployment before changing production.
