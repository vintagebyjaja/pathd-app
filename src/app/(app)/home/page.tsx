import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentMember } from "@/lib/data/member";
import { searchJobs } from "@/lib/data/jobs-repository";
import { JobCard } from "@/components/jobs/JobCard";
import { LinkButton } from "@/components/ui/Button";
import { NavIcon } from "@/components/layout/AppNav";

export const metadata: Metadata = { title: "Home" };

const QUICK = [
  { href: "/map", label: "Explore Map", icon: "map" },
  { href: "/swipe", label: "Swipe jobs", icon: "swipe" },
  { href: "/routes", label: "View route", icon: "routes" },
  { href: "/radar", label: "Radar", icon: "network" },
  { href: "/circles", label: "Circles", icon: "circles" },
] as const;

export default async function HomePage({ searchParams }: { searchParams: Promise<{ welcome?: string }> }) {
  const member = await getCurrentMember();
  if (!member) redirect("/onboarding");
  const { welcome } = await searchParams;

  const results = await searchJobs({ sort: "match" }, member.matchProfile);
  const strong = results.filter((r) => r.match.score >= 80);

  return (
    <div className="grid gap-10">
      {welcome === "demo" && (
        <p role="status" className="rounded-2xl bg-lavender-wash p-4 text-sm text-plum">
          Your answers weren&apos;t saved because accounts aren&apos;t connected yet. You&apos;re viewing a fictional demo member.
        </p>
      )}

      <section>
        <p className="text-plum-soft">Hi, {member.firstName}.</p>
        <h1 className="mt-1 font-display text-4xl leading-tight text-plum md:text-5xl">Where will your path take you?</h1>
      </section>

      <section aria-labelledby="your-path" className="grid gap-5 md:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[var(--radius-card)] bg-plum p-6 text-cream">
          <h2 id="your-path" className="text-sm font-semibold text-cream/75">Your path</h2>
          <ol className="mt-4 grid gap-3">
            <li className="flex items-center gap-3">
              <span className="h-3.5 w-3.5 rounded-full bg-cream" aria-hidden="true" />
              <span className="font-display text-2xl">{member.currentRole ?? "Add your current role"}</span>
              <span className="text-xs text-cream/70">Now</span>
            </li>
            <li className="ml-[6px] h-6 border-l-2 border-dashed border-cream/40" aria-hidden="true" />
            <li className="flex items-center gap-3">
              <span className="h-3.5 w-3.5 rounded-full bg-gold" aria-hidden="true" />
              <span className="font-display text-2xl">{member.careerGoal ?? "Set a career goal"}</span>
              <span className="text-xs text-cream/70">Goal</span>
            </li>
          </ol>
          <p className="mt-5 text-sm text-cream/80">Waypoints and readiness scores arrive with Routes.</p>
        </div>

        <div className="grid content-start gap-3 rounded-[var(--radius-card)] border border-line bg-paper p-6">
          <p className="font-display text-5xl text-plum">{strong.length}</p>
          <p className="text-plum-deep">jobs match you at 80% or better</p>
          <LinkButton href="/jobs" variant="action" className="mt-2 justify-self-start">See your matches</LinkButton>
        </div>
      </section>

      <nav aria-label="Shortcuts">
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
          {QUICK.map((q) => (
            <li key={q.href}>
              <Link href={q.href} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-paper px-2 py-4 text-center text-sm text-plum hover:border-plum">
                <NavIcon icon={q.icon} className="h-6 w-6" />
                {q.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-labelledby="top-matches">
        <div className="flex items-end justify-between">
          <h2 id="top-matches" className="font-display text-2xl text-plum">Top matches</h2>
          <Link href="/jobs" className="text-sm font-semibold text-plum underline underline-offset-4">All jobs</Link>
        </div>
        <ul className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, 6).map((r) => (
            <li key={r.job.id}><JobCard result={r} /></li>
          ))}
        </ul>
      </section>
    </div>
  );
}
