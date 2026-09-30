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
        <div className="mt-12">
          <PricingTable />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
