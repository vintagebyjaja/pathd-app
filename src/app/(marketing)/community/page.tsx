import type { Metadata } from "next";
import Link from "next/link";
import { CIRCLES, POSTS } from "@/lib/explore/samples";
import { FIELD_BY_ID } from "@/lib/explore/fields";

export const metadata: Metadata = { title: "Community" };

const GROUPS = [
  { name: "Connections", body: "Add friends and colleagues, view profiles, and see who you know at a company.", tag: "Free", bg: "bg-paper" },
  { name: "Study groups", body: "Prepare for the NCLEX, CPA, PMP, SHRM or ARE with people near you or online.", tag: "PATHD+", bg: "bg-lavender-wash" },
  { name: "Licensure cohorts", body: "Track requirements alongside people on the same path.", tag: "PATHD+", bg: "bg-lavender-wash" },
  { name: "Student groups", body: "Find your major and class year before you graduate.", tag: "PATHD+", bg: "bg-lavender-wash" },
];

const KIND_STYLE: Record<string, string> = {
  "Reset event": "bg-olive-wash text-olive-ink",
  Milestone: "bg-lavender-wash text-plum",
  "Career event": "bg-peach-wash text-plum",
  "New in the neighborhood": "bg-gold-wash text-gold-ink",
  Volunteer: "bg-olive-wash text-olive-ink",
  "Community win": "bg-lavender-wash text-plum",
};

export default function CommunityPage() {
  return (
    <main id="main" className="mx-auto grid max-w-6xl gap-14 px-5 py-10">
      <section aria-labelledby="h-groups">
        <h1 id="h-groups" className="font-display text-4xl text-plum md:text-5xl">You don&apos;t have to get there alone.</h1>
        <p className="mt-3 max-w-xl text-lg text-plum-soft">Connections are free. Browse every circle and study group for free, and join with PATHD+.</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {GROUPS.map((g) => (
            <li key={g.name} className={`rounded-[var(--radius-card)] border border-line p-5 ${g.bg}`}>
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-semibold text-plum-deep">{g.name}</h2>
                <span className={g.tag === "Free" ? "rounded-full bg-olive-wash px-2.5 py-0.5 text-xs font-bold text-olive-ink" : "rounded-full bg-plum px-2.5 py-0.5 text-xs font-bold text-cream"}>{g.tag}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-plum-soft">{g.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="h-circles">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="h-circles" className="font-display text-3xl text-plum">Circles near you</h2>
          <Link href="/explore" className="text-sm font-semibold text-plum underline underline-offset-4">See them on the map</Link>
        </div>
        <ul className="mt-5 grid gap-3 md:grid-cols-2">
          {CIRCLES.map((c) => (
            <li key={c.id} className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-lavender font-bold text-plum-deep">{c.members}</span>
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-plum-deep">{c.title}</h3>
                <p className="text-sm text-plum-soft">{FIELD_BY_ID[c.field].name}. {c.when}.</p>
              </div>
              <Link href="/pricing" className="shrink-0 rounded-full bg-plum px-3.5 py-2 text-sm font-semibold text-cream">Join</Link>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-plum-soft">Member lists and chat unlock when you join with PATHD+. Sample circles.</p>
      </section>

      <section id="business" aria-labelledby="h-business" className="scroll-mt-24">
        <h2 id="h-business" className="font-display text-3xl text-plum">Restaurants and local businesses</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-[var(--radius-card)] border border-line bg-peach-wash p-6">
            <h3 className="font-semibold text-plum-deep">Restaurants</h3>
            <p className="mt-2 text-sm leading-relaxed text-plum-soft">Share open tables and private rooms for study groups and meetups, and let the neighborhood know you&apos;re ready for them.</p>
          </div>
          <div className="rounded-[var(--radius-card)] border border-line bg-gold-wash p-6">
            <h3 className="font-semibold text-plum-deep">Local businesses</h3>
            <p className="mt-2 text-sm leading-relaxed text-plum-soft">Coffee shops, gyms, studios and coworking spaces can post open spots in classes and workshops, host Circles, or invite new customers.</p>
          </div>
        </div>
        <Link href="/pricing" className="mt-4 inline-flex h-11 items-center rounded-full bg-peach px-5 font-semibold text-plum-deep">List your business</Link>
      </section>

      <section id="neighborhood" aria-labelledby="h-news" className="scroll-mt-24">
        <h2 id="h-news" className="font-display text-3xl text-plum">Good news from your neighborhood</h2>
        <p className="mt-2 max-w-xl text-plum-soft">Community events, milestones and local wins from members and verified businesses. Moderated, with no engagement bait.</p>
        <ul className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((p) => (
            <li key={p.id} className="flex flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-paper p-5">
              <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-bold ${KIND_STYLE[p.kind] ?? ""}`}>{p.kind}</span>
              <h3 className="font-semibold leading-snug text-plum-deep">{p.title}</h3>
              <p className="text-sm text-plum-soft">{p.body}</p>
              <p className="mt-auto text-sm font-semibold text-plum">{p.when}</p>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-plum-soft">Sample posts.</p>
      </section>
    </main>
  );
}
