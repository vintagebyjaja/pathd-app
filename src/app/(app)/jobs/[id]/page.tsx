import AskMila from "@/components/companion/AskMila";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getJobRepository } from "@/lib/data/jobs-repository";
import { getCurrentMember } from "@/lib/data/member";
import { enrich } from "@/lib/data/jobs-repository";
import { DEMO_MATCH_PROFILE } from "@/lib/data/demo/profile";
import { formatSalaryLong } from "@/lib/salary/format";
import { formatMiles } from "@/lib/geo/distance";
import { SalaryBadge } from "@/components/jobs/JobCard";
import { MatchBadge } from "@/components/jobs/JobCard";
import { SkillMatchList } from "@/components/jobs/JobCard";
import { DemoBadge } from "@/components/ui/Button";
import { Button } from "@/components/ui/Button";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const job = await getJobRepository().getById((await params).id);
  return { title: job ? `${job.title} at ${job.company.name}` : "Job not found" };
}

const WORK = { remote: "Remote", hybrid: "Hybrid", onsite: "In person" } as const;

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
  const job = await getJobRepository().getById((await params).id);
  if (!job) notFound();
  const member = await getCurrentMember();
  const { match, miles } = enrich(job, member?.matchProfile ?? DEMO_MATCH_PROFILE);
  const long = formatSalaryLong(job.salary);

  return (
    <article className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <Link href="/jobs" className="text-sm font-semibold text-plum underline underline-offset-4">Back to jobs</Link>
        <div className="mt-6">
          <SalaryBadge salary={job.salary} size="lg" />
          {long && <p className="mt-2 text-sm text-plum-soft">{long}</p>}
          {job.salary.source === "pathd_estimate" && job.salary.estimateBasis && (
            <p className="mt-1 text-sm text-plum-soft">How we estimated this: {job.salary.estimateBasis}. The employer did not list pay.</p>
          )}
        </div>
        <AskMila title={job.title} context={{job_id:job.id,company:job.company.name,skills:job.requiredSkills,is_demo:job.isDemo}}/><h1 className="mt-6 font-display text-4xl leading-tight text-plum">{job.title}</h1>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-plum-deep">
          {job.company.name} {job.isDemo && <DemoBadge />}
        </p>
        <p className="mt-1 text-plum-soft">
          {job.workType === "remote" ? `Remote, ${job.remoteScope === "worldwide" ? "worldwide" : "USA"}` : `${job.location.city}, ${job.location.region}`}
          {miles != null && job.workType !== "remote" ? `, ${formatMiles(miles)}` : ""}. {WORK[job.workType]}.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button variant="action" size="lg" disabled aria-describedby="apply-note">
            {job.applyMethod === "external" ? "Continue to employer" : "Prepare application"}
          </Button>
          <Button variant="outline" size="lg" disabled aria-describedby="apply-note">Save</Button>
        </div>
        <p id="apply-note" className="mt-2 text-sm text-plum-soft">Applying and saving open in the next release. You&apos;ll review everything before it&apos;s sent.</p>

        <section className="mt-10 max-w-prose">
          <h2 className="font-display text-2xl text-plum">About the role</h2>
          <p className="mt-3 leading-relaxed text-plum-deep">{job.description}</p>
          <h3 className="mt-6 font-semibold text-plum-deep">Required skills</h3>
          <p className="mt-1 text-plum-soft">{job.requiredSkills.join(", ") || "None listed"}</p>
          {job.preferredSkills.length > 0 && (
            <>
              <h3 className="mt-4 font-semibold text-plum-deep">Nice to have</h3>
              <p className="mt-1 text-plum-soft">{job.preferredSkills.join(", ")}</p>
            </>
          )}
          {job.requiredLicenses.length > 0 && (
            <>
              <h3 className="mt-4 font-semibold text-plum-deep">Required licensure</h3>
              <p className="mt-1 text-plum-soft">{job.requiredLicenses.join(", ")}</p>
            </>
          )}
        </section>
      </div>

      <aside aria-labelledby="why" className="h-fit rounded-[var(--radius-card)] border border-line bg-paper p-6 lg:sticky lg:top-24">
        <div className="flex items-center justify-between">
          <h2 id="why" className="font-display text-xl text-plum">Why you match</h2>
          <MatchBadge score={match.score} />
        </div>
        <div className="mt-5">
          <SkillMatchList criteria={match.criteria} />
        </div>
        <p className="mt-5 text-xs leading-relaxed text-plum-soft">
          PATHD Match compares job requirements with your profile and preferences only. It never uses age, race, sex, religion,
          disability or other protected traits.
        </p>
      </aside>
    </article>
  );
}
