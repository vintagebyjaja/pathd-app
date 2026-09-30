import type { MatchCriterion, SalaryInfo } from "@/types/domain";
import { SALARY_SOURCE_LABEL, formatSalaryShort } from "@/lib/salary/format";
import { cn } from "@/lib/env";
import Link from "next/link";
import type { JobResult } from "@/lib/data/jobs-repository";
import { formatMiles } from "@/lib/geo/distance";
import { DemoBadge } from "@/components/ui/Button";

/**
 * NO HIDDEN PAY. The three salary sources are visually distinct:
 * - Employer listed: solid figure, solid underline tag.
 * - PATHD estimate: "≈" prefix, dashed outline, never styled like a listed figure.
 * - Pay not provided: stated plainly, no number.
 */
export function SalaryBadge({ salary, size = "md" }: { salary: SalaryInfo; size?: "md" | "lg" }) {
  const text = formatSalaryShort(salary);
  const big = size === "lg" ? "text-3xl" : "text-2xl";

  if (salary.source === "not_provided" || !text) {
    return (
      <div>
        <p className={cn("font-display text-plum-soft", size === "lg" ? "text-2xl" : "text-xl")}>Pay not provided</p>
        <p className="mt-0.5 text-xs text-plum-soft">The employer didn&apos;t share pay. We won&apos;t guess.</p>
      </div>
    );
  }

  if (salary.source === "pathd_estimate") {
    return (
      <div>
        <p className={cn("font-display text-plum-soft", big)}>
          <span aria-hidden="true">≈ </span>
          {text}
        </p>
        <span
          className="mt-1 inline-flex items-center gap-1 rounded-full border border-dashed border-plum-soft/60 px-2 py-0.5 text-[11px] font-semibold text-plum-soft"
          title={salary.estimateBasis}
        >
          {SALARY_SOURCE_LABEL.pathd_estimate}
          <span className="sr-only">: {salary.estimateBasis}</span>
        </span>
      </div>
    );
  }

  return (
    <div>
      <p className={cn("font-display text-plum", big)}>{text}</p>
      <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-plum px-2 py-0.5 text-[11px] font-semibold text-cream">
        <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3">
          <path d="M2.5 6.2l2.2 2.2 4.8-5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
        {SALARY_SOURCE_LABEL.employer_listed}
      </span>
    </div>
  );
}

export function MatchBadge({ score, className }: { score: number; className?: string }) {
  const tone = score >= 85 ? "bg-plum text-cream" : score >= 65 ? "bg-lavender text-plum-deep" : "bg-cream text-plum border border-line";
  return (
    <span className={cn("inline-flex items-baseline gap-1 rounded-full px-3 py-1 text-sm font-semibold", tone, className)}>
      {score}%<span className="text-xs font-medium opacity-80">match</span>
    </span>
  );
}

const ICON = {
  met: { glyph: "✓", sr: "Meets", cls: "bg-olive-wash text-olive-ink" },
  partial: { glyph: "△", sr: "Partly meets", cls: "bg-gold-wash text-gold-ink" },
  missing: { glyph: "✕", sr: "Missing", cls: "bg-peach-wash text-plum" },
} as const;

/** Explains a PATHD Match score line by line. */
export function SkillMatchList({ criteria, compact = false }: { criteria: MatchCriterion[]; compact?: boolean }) {
  return (
    <ul className={cn("grid", compact ? "gap-1.5" : "gap-2.5")}>
      {criteria.map((c) => {
        const i = ICON[c.status];
        return (
          <li key={c.key} className="flex items-start gap-2.5 text-sm">
            <span aria-hidden="true" className={cn("mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-[11px] font-bold", i.cls)}>
              {i.glyph}
            </span>
            <span className="grid">
              <span className="font-semibold text-plum">
                <span className="sr-only">{i.sr}: </span>
                {c.label}
              </span>
              <span className="text-plum-soft">{c.detail}</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}

const WORK_LABEL = { remote: "Remote", hybrid: "Hybrid", onsite: "In person" } as const;

function postedLabel(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `Posted ${mins} min ago`;
  const h = Math.round(mins / 60);
  if (h < 48) return `Posted ${h}h ago`;
  return `Posted ${Math.round(h / 24)} days ago`;
}

/** Salary-first job card used in search, Radar and swipe. */
export function JobCard({ result }: { result: JobResult }) {
  const { job, match, miles } = result;
  const where =
    job.workType === "remote"
      ? `Remote ${job.remoteScope === "worldwide" ? "worldwide" : "USA"}`
      : `${job.location.city}, ${job.location.region}${miles != null ? `, ${formatMiles(miles)}` : ""}`;

  return (
    <article className="group relative flex flex-col gap-4 rounded-[var(--radius-card)] border border-line bg-paper p-5 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-lift)]">
      <div className="flex items-start justify-between gap-3">
        <SalaryBadge salary={job.salary} />
        <MatchBadge score={match.score} />
      </div>
      <div>
        <h3 className="text-lg font-semibold leading-snug text-plum-deep">
          <Link href={`/jobs/${job.id}`} className="after:absolute after:inset-0 after:rounded-[var(--radius-card)] focus-visible:outline-none">
            {job.title}
          </Link>
        </h3>
        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-sm text-plum-soft">
          {job.company.name}
          {job.isDemo && <DemoBadge />}
        </p>
      </div>
      <dl className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-plum">
        <div><dt className="sr-only">Location</dt><dd>{where}</dd></div>
        <div><dt className="sr-only">Work style</dt><dd>{WORK_LABEL[job.workType]}</dd></div>
        <div><dt className="sr-only">Posted</dt><dd className="text-plum-soft">{postedLabel(job.postedAt)}</dd></div>
      </dl>
    </article>
  );
}
