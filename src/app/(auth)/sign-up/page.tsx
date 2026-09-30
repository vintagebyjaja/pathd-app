import type { Metadata } from "next";
import Link from "next/link";
import { AuthForm } from "../AuthForm";
import { signUp } from "../actions";
import { isDemoMode } from "@/lib/env";

export const metadata: Metadata = { title: "Create your account" };

export default function SignUpPage() {
  return (
    <>
      <h1 className="font-display text-4xl text-plum">Start your path</h1>
      <p className="mb-8 mt-2 text-plum-soft">Free to join. You control who sees what.</p>
      <AuthForm action={signUp} submitLabel="Create account" demo={isDemoMode} />
      <p className="mt-6 text-sm text-plum-soft">
        Already have an account? <Link href="/sign-in" className="font-semibold text-plum underline underline-offset-4">Sign in</Link>
      </p>
    </>
  );
}
