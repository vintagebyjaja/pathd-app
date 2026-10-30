import {getPublicSupabaseConfig} from "./config";
import { createBrowserClient } from "@supabase/ssr";

/** Browser client. Uses only the public anon key; row-level security does the rest. */
export function createSupabaseBrowserClient() {
  const config=getPublicSupabaseConfig();if(!config.configured)throw Error("Supabase sign-in needs public configuration. Please contact the site owner.");
  return createBrowserClient(config.url,config.key,{cookieOptions:{secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/'}});
}
