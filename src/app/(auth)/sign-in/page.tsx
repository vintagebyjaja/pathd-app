import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "../AuthForm";
import { signIn } from "../actions";
import { isDemoMode } from "@/lib/env";

export const metadata: Metadata = { title: "Sign in" };

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next,error } = await searchParams;
  return (
    <>
      <h1 className="font-display text-4xl text-plum">Welcome back</h1>
      <p className="mb-8 mt-2 text-plum-soft">Pick up where your path left off.</p>
      {error&&<p role="alert" className="mb-4 text-plum">That sign-in method could not finish. Try again or continue with email.</p>}
      <AuthForm action={signIn} submitLabel="Sign in" next={next ?? "/home"} demo={isDemoMode} />
      <p className="mt-6 text-sm text-plum-soft">
        New to PATHD? <Link href="/sign-up" className="font-semibold text-plum underline underline-offset-4">Create an account</Link>
      </p>
    </>
  );
}
