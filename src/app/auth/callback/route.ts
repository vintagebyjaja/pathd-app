import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/** Email-confirmation and OAuth code exchange. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const nextParam = searchParams.get("next") ?? "/home";
  const next = nextParam.startsWith("/") && !nextParam.startsWith("//") && !nextParam.includes("\\") ? nextParam : "/home";
  if (code) {
    const sb = await createSupabaseServerClient();
    const previous=await sb.auth.getSession();
    const { data,error } = await sb.auth.exchangeCodeForSession(code);
    const expected=request.cookies.get('pathd-link-user')?.value;
    if(expected&&data?.user?.id!==expected){if(previous.data.session)await sb.auth.setSession(previous.data.session);else await sb.auth.signOut({scope:'local'});return NextResponse.redirect(`${origin}/sign-in?error=link`);}
    if (!error) {const response=NextResponse.redirect(`${origin}${next}`);response.cookies.set('pathd-link-user','',{path:'/auth',maxAge:0});return response;}
  }
  return NextResponse.redirect(`${origin}/sign-in?error=link`);
}
