import "server-only";
import {getPublicSupabaseConfig} from "./config";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const config=getPublicSupabaseConfig();if(!config.configured)throw Error("Supabase sign-in needs public runtime/build configuration.");
  return createServerClient(config.url, config.key, {
    cookieOptions:{secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/'},
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (toSet: { name: string; value: string; options: CookieOptions }[]) => {
        try {
          toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: middleware refreshes the session instead.
        }
      },
    },
  });
}

/**
 * Service-role client. Bypasses row-level security, so use it only in server
 * code, only after checking the caller is allowed, and never expose the key.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase service role is not configured.");
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
