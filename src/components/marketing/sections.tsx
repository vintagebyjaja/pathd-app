import { cn } from "@/lib/env";
import { SalaryBadge } from "@/components/jobs/JobCard";
import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";

export interface Plan {
  id: "free" | "plus" | "pro" | "local" | "employer" | "recruiter";
  name: string;
  audience: "people" | "business";
  monthly: number;
  yearly: number | null;
  summary: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "free", name: "PATHD Free", audience: "people", monthly: 0, yearly: 0,
    summary: "Everything you need to find work. Pay is never hidden behind a paywall.",
    features: ["Job search with pay on every listing", "Map with distance from home and school", "Remote jobs in PATHD Cloud", "Profile, resume and applications", "Connections: add friends, view profiles", "Browse Circles and study groups: size and distance", "Basic swipe, Routes and Radar", "Neighborhood board and Local discovery", "PATHD Charts, Milestone Perks and Link Up"],
  },
  {
    id: "plus", name: "PATHD+", audience: "people", monthly: 5.99, yearly: 49,
    summary: "Join your people and plan your next move.",
    features: ["Join Circles and study groups", "Connect and message inside Circles", "Start and host study sessions", "Full Career Routes and skill gaps", "Advanced filters and swiping", "Enhanced Radar and saved searches", "Application tracking"],
  },
  {
    id: "pro", name: "PATHD Pro", audience: "people", monthly: 11.99, yearly: 99,
    summary: "Deeper career intelligence and licensure tracking.",
    features: ["Everything in PATHD+", "Multiple resume profiles", "Advanced matching and Career GPS", "Detailed salary comparisons", "Licensure pathway tracking", "Priority Radar"],
  },
  {
    id: "local", name: "PATHD Local", audience: "business", monthly: 29, yearly: null,
    summary: "For coffee shops, gyms, studios and neighborhood businesses.",
    features: ["Enhanced business page", "Offers and events", "Map visibility tools", "Circle hosting", "Analytics"],
  },
  {
    id: "employer", name: "PATHD Employer", audience: "business", monthly: 79, yearly: null,
    summary: "Your first basic job post is free.",
    features: ["Multiple active jobs", "Applicant dashboard", "Candidate matching", "Company page and messaging", "Hiring analytics"],
  },
  {
    id: "recruiter", name: "PATHD Recruiter", audience: "business", monthly: 199, yearly: null,
    summary: "For agency and independent recruiters.",
    features: ["Candidate search and filters", "Outreach and talent pools", "Multiple clients", "Recruiting analytics"],
  },
];

function price(p: Plan) {
  if (p.monthly === 0) return { main: "$0", sub: "Free forever" };
  return { main: `$${p.monthly}`, sub: p.yearly ? `per month, or $${p.yearly} a year` : "per month" };
}

function PlanCard({ plan, featured }: { plan: Plan; featured?: boolean }) {
  const pr = price(plan);
  return (
    <li className={cn("flex flex-col rounded-[var(--radius-card)] border p-6", featured ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum-deep")}>
      <h3 className="font-display text-2xl">{plan.name}</h3>{plan.id!=="free"&&<p className="mt-2 text-sm font-semibold">Coming Soon · Proposed pricing</p>}
      <p className={cn("mt-4 font-display text-4xl", featured ? "text-cream" : "text-plum")}>{pr.main}</p>
      <p className={cn("text-sm", featured ? "text-cream/75" : "text-plum-soft")}>{pr.sub}</p>
      <p className={cn("mt-4 text-sm leading-relaxed", featured ? "text-cream/85" : "text-plum-soft")}>{plan.summary}</p>
      <ul className="mt-5 grid gap-2 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-2">
            <span aria-hidden="true" className={featured ? "text-peach" : "text-olive-ink"}>✓</span>
            {f}
          </li>
        ))}
      </ul>
    </li>
  );
}

export function PricingTable() {
  const people = PLANS.filter((p) => p.audience === "people");
  const business = PLANS.filter((p) => p.audience === "business");
  return (
    <div className="grid gap-14">
      <div>
        <h3 className="text-lg font-semibold text-plum-deep">For people</h3>
        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {people.map((p) => (
            <PlanCard key={p.id} plan={p} featured={p.id === "plus"} />
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-plum-deep">For businesses</h3>
        <ul className="mt-5 grid gap-5 md:grid-cols-3">
          {business.map((p) => (
            <PlanCard key={p.id} plan={p} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function PayPrinciple() {
  return (
    <section id="pay" aria-labelledby="h-pay" className="bg-plum-deep text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.3fr] md:py-20">
        <div>
          <h2 id="h-pay" className="font-display text-4xl leading-tight md:text-5xl">No hidden pay.</h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-cream/80">
            Know what the opportunity pays before you spend your time. Pay sits at the top of every listing, and we always tell
            you where the number came from. Your own pay is never shown to anyone.
          </p>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2">
          <li className="rounded-[var(--radius-card)] bg-paper p-5 text-plum-deep">
            <SalaryBadge salary={{ source: "employer_listed", min: 95000, max: 115000, period: "year", currency: "USD" }} />
            <p className="mt-3 text-sm text-plum-soft">The employer published this range.</p>
          </li>
          <li className="rounded-[var(--radius-card)] bg-paper p-5 text-plum-deep">
            <SalaryBadge salary={{ source: "pathd_estimate", min: 60000, max: 72000, period: "year", currency: "USD", estimateBasis: "Regional pay data for similar roles" }} />
            <p className="mt-3 text-sm text-plum-soft">We calculated this from reliable pay data, and show you how.</p>
          </li>
          <li className="rounded-[var(--radius-card)] bg-paper p-5 text-plum-deep">
            <SalaryBadge salary={{ source: "not_provided", min: null, max: null, period: "year", currency: "USD" }} />
          </li>
          <li className="rounded-[var(--radius-card)] bg-lavender-wash p-5 text-plum-deep">
            <p className="font-display text-xl text-plum">Your pay stays yours.</p>
            <p className="mt-2 text-sm leading-relaxed text-plum-soft">We never ask what you earn now. Set the minimum you&apos;d take for your next job, and only you see it. Employers only see whether you fit their posted range.</p>
          </li>
        </ul>
      </div>
    </section>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 md:grid-cols-[280px_1fr]">
        <Image src="/brand/pathd-logo.png" alt="PATHD logo: a tree of connected people rooted in paths" width={280} height={280} className="mx-auto rounded-3xl" />
        <div>
          <p className="font-display text-3xl leading-snug text-plum md:text-4xl">Jobs are only one part of your path.</p>
          <LinkButton href="/sign-up" variant="action" size="lg" className="mt-6">Start your path</LinkButton>
          <nav aria-label="Footer" className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-plum-soft">
            <Link href="/explore">Map</Link>
            <Link href="/explore/jobs">Jobs</Link>
            <Link href="/community">Community</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/sign-in">Sign in</Link>
            <Link href="/legal/privacy">Privacy</Link>
            <Link href="/legal/terms">Terms</Link>
          </nav>
          <p className="mt-4 text-xs text-plum-soft">© {new Date().getFullYear()} PATHD. PATHD does not grant professional licenses.</p>
        </div>
      </div>
    </footer>
  );
}
