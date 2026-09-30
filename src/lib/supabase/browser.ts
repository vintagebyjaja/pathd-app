import { createBrowserClient } from "@supabase/ssr";

/** Browser client. Uses only the public anon key; row-level security does the rest. */
export function createSupabaseBrowserClient() {
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
}
