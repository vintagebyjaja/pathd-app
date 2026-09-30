import type { FieldId, GeoPoint, Job } from "@/types/domain";
import { DEMO_JOBS } from "@/lib/data/demo/jobs";
import { annualMidpoint, formatSalaryShort } from "@/lib/salary/format";
import { milesBetween } from "@/lib/geo/distance";

/**
 * Public explore screens read the sample catalog directly (it ships with the
 * page). When real listings arrive, swap this for a fetch from the job API.
 */
export const EXPLORE_JOBS: Job[] = DEMO_JOBS;

export function jobsInField(field: FieldId | null): Job[] {
  return field ? EXPLORE_JOBS.filter((j) => j.field === field) : EXPLORE_JOBS;
}

export function distanceTo(from: GeoPoint | null | undefined, job: Job): number | null {
  if (!from || !job.location.point) return null;
  return milesBetween(from, job.location.point);
}

/** Short pay text for map pins: "$85K", "$38/hr", "≈$60K", "Pay n/p". */
export function pinPay(job: Job): string {
  const s = job.salary;
  if (s.source === "not_provided" || s.min == null) return "Pay n/p";
  const lo = s.period === "hour" ? `$${s.min}/hr` : `$${Math.round(s.min / 1000)}K`;
  return s.source === "pathd_estimate" ? `≈${lo}` : lo;
}

export function payText(job: Job): string {
  const t = formatSalaryShort(job.salary);
  if (!t) return "Pay not provided";
  return job.salary.source === "pathd_estimate" ? `≈ ${t}` : t;
}

export function annualPay(job: Job): number {
  return annualMidpoint(job.salary) ?? -1;
}

export function fmtMiles(m: number): string {
  if (m < 0.1) return "under 0.1 mi";
  return m < 10 ? `${m.toFixed(1)} mi` : `${Math.round(m)} mi`;
}

export function workLabel(job: Job): string {
  if (job.workType === "remote") return job.remoteScope === "worldwide" ? "Remote, worldwide" : "Remote, USA";
  return job.workType === "hybrid" ? "Hybrid" : "In person";
}

export function postedLabel(iso: string): string {
  const mins = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} min ago`;
  const h = Math.round(mins / 60);
  return h < 48 ? `${h}h ago` : `${Math.round(h / 24)} days ago`;
}
