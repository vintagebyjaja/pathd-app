import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentMember } from "@/lib/data/member";
import { LinkButton } from "@/components/ui/Button";
import { DemoBadge } from "@/components/ui/Button";
import { PortfolioManager } from "@/components/profile/PortfolioManager";
import { isSupabaseConfigured } from "@/lib/env";
import { PORTFOLIO_SELECT, toView, type PortfolioRow } from "@/lib/portfolio/server";
import type { PortfolioItemView } from "@/lib/portfolio/types";

async function loadPortfolio(): Promise<PortfolioItemView[]> {
  if (!isSupabaseConfigured) return [];
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const sb = await createSupabaseServerClient();
  const { data } = await sb
    .from("portfolio_items")
    .select(PORTFOLIO_SELECT)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return ((data ?? []) as unknown as PortfolioRow[]).filter((r) => r.status !== "rejected").map(toView);
}

export const metadata: Metadata = { title: "Your profile" };

function Chips({ items, tone }: { items: string[]; tone: string }) {
  if (items.length === 0) return <p className="text-sm text-plum-soft">None added yet.</p>;
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((s) => (
        <li key={s} className={`rounded-full px-3 py-1 text-sm ${tone}`}>{s}</li>
      ))}
    </ul>
  );
}

export default async function ProfilePage() {
  const m = await getCurrentMember();
  if (!m) redirect("/onboarding");
  const p = m.matchProfile.preferences;
  const portfolio = await loadPortfolio();
  return (
    <div className="grid gap-8">
    <div className="grid gap-8 md:grid-cols-[1.3fr_1fr]">
      <section className="rounded-[var(--radius-card)] border border-line bg-paper p-6">
        <div className="flex items-start gap-4">
          <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-lavender font-display text-2xl text-plum-deep" aria-hidden="true">
            {m.firstName[0]}
          </div>
          <div>
            <h1 className="flex flex-wrap items-center gap-2 font-display text-3xl text-plum">
              {m.fullName} {m.isDemo && <DemoBadge />}
            </h1>
            {m.headline && <p className="mt-1 text-plum-deep">{m.headline}</p>}
            {m.city && <p className="text-sm text-plum-soft">{m.city}</p>}
          </div>
        </div>
        <h2 className="mt-8 font-semibold text-plum-deep">Skills</h2>
        <div className="mt-3"><Chips items={m.skills} tone="bg-cream text-plum" /></div>
        <h2 className="mt-6 font-semibold text-plum-deep">Certifications</h2>
        <div className="mt-3"><Chips items={m.certifications} tone="bg-gold-wash text-gold-ink" /></div>
        <h2 className="mt-6 font-semibold text-plum-deep">Licenses</h2>
        <div className="mt-3"><Chips items={m.licenses} tone="bg-gold-wash text-gold-ink" /></div>
        <LinkButton href="/onboarding" variant="outline" className="mt-8">Edit profile</LinkButton>
      </section>

      <section className="h-fit rounded-[var(--radius-card)] border border-line bg-paper p-6">
        <h2 className="font-display text-xl text-plum">What you&apos;re looking for</h2>
        <p className="mt-1 text-xs text-plum-soft">Only you can see this section.</p>
        <dl className="mt-5 grid gap-4 text-sm">
          <div><dt className="font-semibold text-plum-deep">Roles</dt><dd className="text-plum-soft">{p.desiredRoles.join(", ") || "Not set"}</dd></div>
          <div><dt className="font-semibold text-plum-deep">Minimum pay for next job</dt><dd className="text-plum-soft">{p.salaryTarget ? `$${p.salaryTarget.toLocaleString()} a year` : "Not set"}</dd></div>
          <div><dt className="font-semibold text-plum-deep">Work style</dt><dd className="text-plum-soft">{p.workTypes.map((w) => (w === "onsite" ? "In person" : w)).join(", ") || "Any"}</dd></div>
          <div><dt className="font-semibold text-plum-deep">Commute</dt><dd className="text-plum-soft">{p.commuteMiles ? `Up to ${p.commuteMiles} miles` : "No limit"}</dd></div>
        </dl>
      </section>
    </div>
    <PortfolioManager initialItems={portfolio} demo={!isSupabaseConfigured} />
    </div>
  );
}
