import Link from "next/link";
import { HeroRoutes } from "@/components/marketing/HeroRoutes";
import { PayPrinciple } from "@/components/marketing/sections";
import { SiteFooter } from "@/components/marketing/sections";
import { LinkButton } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/explore/parts";
import { FIELDS } from "@/lib/explore/fields";
import { DEMO_JOBS } from "@/lib/data/demo/jobs";

const SCREENS: { href: string; label: string; note: string; icon: IconName; tone: string }[] = [
  { href: "/explore", label: "Map", note: "Jobs by pay and commute", icon: "map", tone: "bg-plum text-cream" },
  { href: "/explore/jobs", label: "Job list", note: "Every field, your way", icon: "jobs", tone: "bg-paper text-plum" },
  { href: "/explore/hot", label: "What's hot", note: "Community news and events", icon: "hot", tone: "bg-peach text-plum-deep" },
  { href: "/explore/linkup", label: "Link Up", note: "Meet halfway for coffee or study", icon: "circles", tone: "bg-lavender text-plum-deep" },
  { href: "/explore/charts", label: "Charts", note: "Best places to work", icon: "jobs", tone: "bg-paper text-plum" },
  { href: "/explore/perks", label: "Milestone Perks", note: "Deals for big career days", icon: "heart", tone: "bg-gold-wash text-plum-deep" },
  { href: "/explore/reset", label: "Reset", note: "Walks, trails, wellness", icon: "reset", tone: "bg-olive text-cream" },
  { href: "/explore/pros", label: "Pros", note: "Mentors and tips", icon: "profile", tone: "bg-paper text-plum" },
];

export default function LandingPage() {
  const counts = new Map<string, number>();
  DEMO_JOBS.forEach((j) => { if (j.field) counts.set(j.field, (counts.get(j.field) ?? 0) + 1); });

  return (
    <>
      <main id="main">
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-14 pt-10 md:grid-cols-2 md:pb-20 md:pt-16">
          <div>
            <h1 className="font-display text-[3.3rem] leading-[0.98] text-plum sm:text-7xl lg:text-[5.4rem]">Find your path.</h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-plum-soft">
              Jobs are only one part of your path. Discover opportunities in nursing, tech, finance, business and more. Know what
              they pay, see how far they are from home, and find your people along the way.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <LinkButton href="/sign-up" variant="action" size="lg">Start your path</LinkButton>
              <LinkButton href="/explore" variant="outline" size="lg">Explore the map</LinkButton>
            </div>
            <p className="mt-5 text-sm text-plum-soft">Live in every state, from Charlotte, Raleigh and Durham to Richmond, Norfolk and Virginia Beach. <Link href="/explore" className="font-semibold text-plum underline underline-offset-4">Pick your city</Link></p>
          </div>
          <HeroRoutes />
        </section>

        <div className="mx-auto mb-4 max-w-6xl px-5">
          <Link href="/explore/perks" className="flex items-center justify-between gap-3 rounded-2xl bg-plum px-5 py-3 text-cream">
            <span><span className="font-semibold">Milestone Perks</span><span className="text-cream/80"> for interview day, new jobs, graduations and more</span></span>
            <span aria-hidden="true" className="text-peach">→</span>
          </Link>
        </div>
        <nav aria-label="Jump to a screen" className="mx-auto max-w-6xl px-5">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {SCREENS.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className={`flex h-full flex-col gap-2 rounded-[var(--radius-card)] border border-line p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)] ${s.tone}`}>
                  <Icon name={s.icon} className="h-6 w-6" />
                  <span className="font-semibold">{s.label}</span>
                  <span className="text-[13px] opacity-80">{s.note}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <section id="fields" aria-labelledby="h-fields" className="mx-auto max-w-6xl scroll-mt-24 px-5 py-16 md:py-20">
          <h2 id="h-fields" className="font-display text-4xl text-plum md:text-5xl">Built for your field.</h2>
          <p className="mt-3 max-w-xl text-lg text-plum-soft">Pick a field to see its jobs, pay and study groups.</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {FIELDS.map((f) => (
              <li key={f.id}>
                <Link href={`/explore/jobs?field=${f.id}`} className="flex h-full flex-col gap-2 rounded-[var(--radius-card)] border border-line bg-paper p-4 hover:border-plum">
                  <span className="flex items-start justify-between gap-2">
                    <span className="font-display text-xl leading-tight text-plum">{f.name}</span>
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl" style={{ background: `${f.color}22`, color: f.color }}>
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={f.icon} /></svg>
                    </span>
                  </span>
                  <span className="text-sm text-plum-soft">{f.roles}</span>
                  <span className="mt-auto text-[13px] font-semibold text-plum">{counts.get(f.id) ?? 0} sample jobs</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 max-w-2xl text-sm text-plum-soft">PATHD focuses on professional, technical and credentialed careers. Hospitality centers on management, sales and guest operations.</p>
        </section>

        <PayPrinciple />

        <section className="mx-auto max-w-6xl px-5 py-16 text-center md:py-20">
          <h2 className="font-display text-4xl text-plum md:text-5xl">Free to find work. Always.</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-plum-soft">Job search, pay, the map, applications and connections are free. PATHD+ opens up Circles and study groups.</p>
          <LinkButton href="/pricing" variant="outline" size="lg" className="mt-6">See pricing</LinkButton>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
