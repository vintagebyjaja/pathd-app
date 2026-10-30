"use server";

import { redirect } from "next/navigation";
import { companionFetch } from "@/lib/companion/server";
import { z } from "zod";
import { isSupabaseConfigured, isDemoMode } from "@/lib/env";

function authMessage(error:{status?:number;code?:string;message?:string;name?:string}){
 if(/invalid api key/i.test(error.message||''))return 'Supabase rejected the public project key. Please contact the site owner.';
 if(error.status===0||error.name==='AuthRetryableFetchError')return 'Could not reach sign-in. Check your connection and try again.';
 if(error.status===429)return 'Too many attempts. Wait a moment and try again.';
 if(error.code==='email_not_confirmed')return 'Confirm your email before signing in.';
 if(error.code==='user_already_exists'||error.code==='email_exists')return 'This account already exists. Sign in instead.';
 if(error.status && error.status>=500)return 'Sign-in is temporarily unavailable. Please retry.';
 return 'That email and password do not match an account, or the request could not be completed.';
}
export interface AuthState {
  error?: string;
  message?: string;
  codes?: string[];
}

const Credentials = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

/** Only allow same-site relative redirects. */
function safeNext(v: FormDataEntryValue | null): string {
  const s = typeof v === "string" ? v : "";
  return s.startsWith("/") && !s.startsWith("//") && !s.includes("\\")
    ? s
    : "/home";
}

export async function signUp(_: AuthState, form: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) {if(isDemoMode)redirect("/onboarding");return {error:"Supabase sign-up is not configured. Please contact the site owner. No account has been created."};}
  const parsed = Credentials.safeParse({
    email: form.get("email"),
    password: form.get("password"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const sb = await createSupabaseServerClient();
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://mypathd.com";
  const questions = [
      String(form.get("question1") || ""),
      String(form.get("question2") || ""),
    ],
    answers = [
      String(form.get("answer1") || ""),
      String(form.get("answer2") || ""),
    ];
  if (
    questions.some((q) => q.length < 8 || q.length > 160) ||
    questions[0] === questions[1] ||
    answers.some((a) => a.trim().length < 3 || a.length > 200)
  )
    return { error: "Complete two different recovery questions and answers." };
  if (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !form.get("captcha-token"))
    return { error: "Complete the abuse-prevention check." };
  if(parsed.data.password.length<12)return {error:"Use at least 12 characters for a new password."};
  try{const readiness=await companionFetch('/status');const status=await readiness.json();if(!readiness.ok||!status.accounts||!status.databaseConfigured||!status.sessionConfigured)return {error:'Secure account setup is not configured yet. Please contact the site owner. No account has been created.'};}catch{return {error:'Account setup could not be reached. Try again before creating an account.'};}
  const { data, error } = await sb.auth.signUp({
    ...parsed.data,
    options: {
      captchaToken: String(form.get("captcha-token") || ""),
      emailRedirectTo: `${origin}/auth/callback?next=/settings/security`,
      data: {
        signup_product: "pathd",
        display_name: String(form.get("display_name") || "").slice(0, 80),
      },
    },
  });
  if (error) return { error:authMessage(error) };
  if (!data.session)
    return {
      message:
        "Check your email to confirm your account, then come back to finish setup.",
    };
  try {
    const r = await companionFetch(
      "/recovery/enroll",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          password: parsed.data.password,
          questions: [form.get("question1"), form.get("question2")],
          answers: [form.get("answer1"), form.get("answer2")],
        }),
      },
      data.session.access_token,
    );
    const d = await r.json();
    if (!r.ok)
      return {
        error:
          "Your account was created. Sign in and finish Account Security Setup; do not register again.",
      };
    return {
      codes: d.codes,
      message:
        "Your Free account is ready on both platforms. Save these recovery codes.",
    };
  } catch {
    return {
      error:
        "Your account was created, but recovery setup needs the private companion service. Sign in to finish setup; do not register again.",
    };
  }
}

export async function signIn(_: AuthState, form: FormData): Promise<AuthState> {
  const next = safeNext(form.get("next"));
  if (!isSupabaseConfigured) {if(isDemoMode)redirect(next);return {error:"Supabase sign-in is not configured. Please contact the site owner."};}
  const parsed = Credentials.pick({ email: true })
    .extend({ password: z.string().min(1, "Enter your password.") })
    .safeParse({
      email: form.get("email"),
      password: form.get("password"),
    });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message };

  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const sb = await createSupabaseServerClient();
  const { error } = await sb.auth.signInWithPassword(parsed.data);
  // Same message for unknown email and wrong password, to avoid account enumeration.
  if (error)
    return { error: authMessage(error) };
  const verified = await sb.auth.getUser();
  if (verified.error || !verified.data.user) return {error: "Your session could not be verified. Please sign in again."};
  const { data: shared, error: profileError } = await sb
    .schema("core")
    .from("profiles")
    .select("recovery_enrolled_at")
    .eq("user_id", verified.data.user.id)
    .maybeSingle();
  if (profileError)
    return {
      error:
        "Sign-in succeeded, but the shared profile service is unavailable. Please retry.",
    };
  redirect(shared?.recovery_enrolled_at ? next : "/settings/security");
}

export async function signOut() {
  if (isSupabaseConfigured) {
    const { createSupabaseServerClient } = await import(
      "@/lib/supabase/server"
    );
    const sb = await createSupabaseServerClient();
    await sb.auth.signOut({scope:"local"});
  }
  redirect("/");
}
