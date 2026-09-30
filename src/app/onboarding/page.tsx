import type { Metadata } from "next";
import Link from "next/link";
import { PathdWordmark } from "@/components/brand/Logo";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { DemoBanner } from "@/components/ui/Button";
import { isDemoMode } from "@/lib/env";

export const metadata: Metadata = { title: "Set up your path" };

export default function OnboardingPage() {
  return (
    <>
      {isDemoMode && <DemoBanner />}
      <header className="mx-auto max-w-xl px-5 pt-8">
        <Link href="/" aria-label="PATHD home"><PathdWordmark /></Link>
      </header>
      <main id="main" className="px-5 py-10">
        <OnboardingFlow />
      </main>
    </>
  );
}
