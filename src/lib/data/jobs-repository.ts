import "server-only";
import type { Job, MatchProfile, MatchResult, WorkType } from "@/types/domain";
import { isSupabaseConfigured } from "@/lib/env";
import { annualMidpoint } from "@/lib/salary/format";
import { DEMO_JOBS } from "./demo/jobs";
import { scoreMatch } from "@/lib/match/score";
import { milesBetween } from "@/lib/geo/distance";

export interface JobFilters {
  q?: string;
  minSalary?: number; // annual
  workTypes?: WorkType[];
  industries?: string[];
  hideNoPay?: boolean;
}

export interface JobRepository {
  search(filters: JobFilters): Promise<Job[]>;
  getById(id: string): Promise<Job | null>;
}

function textMatch(job: Job, q: string): boolean {
  const hay = [job.title, job.company.name, job.industry, job.location.city, ...job.requiredSkills].join(" ").toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((t) => hay.includes(t));
}

/** In-memory implementation over clearly labeled demo data. */
class DemoJobRepository implements JobRepository {
  async search(f: JobFilters): Promise<Job[]> {
    return DEMO_JOBS.filter((job) => {
      if (f.q && !textMatch(job, f.q)) return false;
      if (f.workTypes?.length && !f.workTypes.includes(job.workType)) return false;
      if (f.industries?.length && !f.industries.includes(job.industry)) return false;
      const mid = annualMidpoint(job.salary);
      if (f.hideNoPay && mid == null) return false;
      // A salary floor only excludes jobs whose *known* pay is below it.
      if (f.minSalary && mid != null) {
        const top = job.salary.period === "hour" ? (job.salary.max ?? 0) * 2080 : job.salary.max ?? 0;
        if (top < f.minSalary) return false;
      }
      return true;
    });
  }
  async getById(id: string) {
    return DEMO_JOBS.find((j) => j.id === id) ?? null;
  }
}

/** Postgres implementation. Reads the RLS-protected `jobs_public` view. */
class SupabaseJobRepository implements JobRepository {
  private async client() {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    return createSupabaseServerClient();
  }
  async search(f: JobFilters): Promise<Job[]> {
    const sb = await this.client();
    let query = sb.from("jobs_public").select("*").order("posted_at", { ascending: false }).limit(100);
    if (f.q) query = query.textSearch("search_vector", f.q, { type: "websearch" });
    if (f.workTypes?.length) query = query.in("work_type", f.workTypes);
    if (f.industries?.length) query = query.in("industry", f.industries);
    if (f.hideNoPay) query = query.neq("salary_source", "not_provided");
    if (f.minSalary) query = query.or(`salary_max_annual.gte.${Math.floor(f.minSalary)},salary_source.eq.not_provided`);
    const { data, error } = await query;
    if (error) throw error;
    return (data ?? []).map(rowToJob);
  }
  async getById(id: string) {
    // Sample listings used by the public explore screens aren't stored with these ids.
    if (id.startsWith("demo_")) return DEMO_JOBS.find((j) => j.id === id) ?? null;
    const sb = await this.client();
    const { data, error } = await sb.from("jobs_public").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return data ? rowToJob(data) : null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToJob(r: any): Job {
  return {
    id: r.id,
    title: r.title,
    company: { id: r.company_id, slug: r.company_slug, name: r.company_name, industry: r.industry, isDemo: r.is_demo },
    industry: r.industry,
    description: r.description,
    salary: {
      source: r.salary_source,
      min: r.salary_min,
      max: r.salary_max,
      period: r.salary_period,
      currency: "USD",
      estimateBasis: r.salary_estimate_basis ?? undefined,
    },
    workType: r.work_type,
    remoteScope: r.remote_scope,
    location: { city: r.city, region: r.region, point: r.lat != null ? { lat: r.lat, lng: r.lng } : null },
    experienceLevel: r.experience_level,
    minYearsExperience: r.min_years_experience,
    educationLevel: r.education_level,
    requiredSkills: r.required_skills ?? [],
    preferredSkills: r.preferred_skills ?? [],
    requiredLicenses: r.required_licenses ?? [],
    preferredCertifications: r.preferred_certifications ?? [],
    postedAt: r.posted_at,
    applyMethod: r.apply_method,
    applyUrl: r.apply_url,
    source: r.source,
    isDemo: r.is_demo,
  };
}

export function getJobRepository(): JobRepository {
  return isSupabaseConfigured ? new SupabaseJobRepository() : new DemoJobRepository();
}

export type SortKey = "match" | "pay" | "recent";

export interface JobResult {
  job: Job;
  match: MatchResult;
  miles: number | null;
}

export function enrich(job: Job, profile: MatchProfile): JobResult {
  const c = profile.preferences.searchCenter;
  return {
    job,
    match: scoreMatch(job, profile),
    miles: c && job.location.point ? milesBetween(c, job.location.point) : null,
  };
}

export async function searchJobs(filters: JobFilters & { maxMiles?: number; sort?: SortKey }, profile: MatchProfile): Promise<JobResult[]> {
  const jobs = await getJobRepository().search(filters);
  let results = jobs.map((j) => enrich(j, profile));
  if (filters.maxMiles) {
    // Remote roles have no commute, so they stay in radius-filtered results.
    results = results.filter((r) => r.job.workType === "remote" || (r.miles != null && r.miles <= filters.maxMiles!));
  }
  const sort = filters.sort ?? "match";
  results.sort((a, b) => {
    if (sort === "pay") return (annualMidpoint(b.job.salary) ?? -1) - (annualMidpoint(a.job.salary) ?? -1);
    if (sort === "recent") return b.job.postedAt.localeCompare(a.job.postedAt);
    return b.match.score - a.match.score;
  });
  return results;
}
