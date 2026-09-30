import type { Metadata } from "next";
import { getCurrentMember } from "@/lib/data/member";
import { searchJobs, type SortKey } from "@/lib/data/jobs-repository";
import { DEMO_MATCH_PROFILE } from "@/lib/data/demo/profile";
import { JobCard } from "@/components/jobs/JobCard";
import { JobFilters, type FilterValues } from "@/components/jobs/JobFilters";
import { EmptyState } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/Button";
import type { WorkType } from "@/types/domain";

export const metadata: Metadata = { title: "Jobs" };

type Params = { [k: string]: string | string[] | undefined };

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const many = (v: string | string[] | undefined) => (v == null ? [] : Array.isArray(v) ? v : [v]);
const num = (v: string | undefined) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export default async function JobsPage({ searchParams }: { searchParams: Promise<Params> }) {
  const sp = await searchParams;
  const values: FilterValues = {
    q: one(sp.q)?.slice(0, 120),
    minSalary: one(sp.minSalary),
    maxMiles: one(sp.maxMiles),
    work: many(sp.work).filter((w): w is WorkType => ["remote", "hybrid", "onsite"].includes(w)),
    industry: one(sp.industry),
    hideNoPay: one(sp.hideNoPay),
    sort: one(sp.sort),
  };
  const sort: SortKey = values.sort === "pay" || values.sort === "recent" ? values.sort : "match";

  const member = await getCurrentMember();
  const profile = member?.matchProfile ?? DEMO_MATCH_PROFILE;

  const results = await searchJobs(
    {
      q: values.q,
      minSalary: num(values.minSalary),
      maxMiles: num(values.maxMiles),
      workTypes: values.work as WorkType[],
      industries: values.industry ? [values.industry] : undefined,
      hideNoPay: values.hideNoPay === "1",
      sort,
    },
    profile,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      <div>
        <h1 className="font-display text-4xl text-plum">Jobs</h1>
        <p className="mb-6 mt-2 text-sm text-plum-soft">Pay first, always. Matches are explained on every listing.</p>
        <details className="lg:hidden" open={false}>
          <summary className="cursor-pointer rounded-full border border-line bg-paper px-4 py-2.5 text-sm font-semibold text-plum">Filters</summary>
          <div className="mt-3"><JobFilters values={values} /></div>
        </details>
        <div className="hidden lg:block"><JobFilters values={values} /></div>
      </div>

      <section aria-labelledby="results" aria-live="polite">
        <h2 id="results" className="text-sm text-plum-soft">
          {results.length} {results.length === 1 ? "job" : "jobs"}
        </h2>
        {results.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="No jobs fit those filters"
              body="Widen the distance, lower the pay floor, or clear a filter to see more."
              action={<LinkButton href="/jobs" variant="outline">Clear filters</LinkButton>}
            />
          </div>
        ) : (
          <ul className="mt-4 grid gap-4 md:grid-cols-2">
            {results.map((r) => (
              <li key={r.job.id}><JobCard result={r} /></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
