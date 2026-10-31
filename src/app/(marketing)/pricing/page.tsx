import type { Metadata } from "next";
import { SiteFooter } from "@/components/marketing/sections";
import { PricingTable } from "@/components/marketing/sections";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <>
      <main id="main" className="mx-auto max-w-6xl px-5 py-16">
        <h1 className="font-display text-5xl text-plum">Pricing</h1>
        <p className="mt-4 max-w-xl text-lg text-plum-soft">
          Finding work is free. People build the network; businesses pay to reach it. Sponsored listings are always labeled.
        </p>
        <aside className="mt-8 rounded-2xl border border-line bg-paper p-6"><h2 className="font-display text-2xl text-plum">Already subscribed to AELIO?</h2><p className="mt-3 text-plum-soft">Access MILA and AELIO on PATHD with your existing subscription. Stay on PATHD Free, or choose PATHD+ independently for community, Circles, messaging and advanced discovery. Paid career features require an eligible PATHD plan.</p><p className="mt-3 text-sm text-plum-soft">PATHD Pro, Local, Employer and Recruiter include both companions. Free and PATHD+ do not include premium companion access on their own. Existing free job applications, resume creation, maps and discovery stay free.</p></aside>
        <div className="mt-12">
          <PricingTable />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
