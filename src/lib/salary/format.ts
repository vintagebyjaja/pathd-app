import type { SalaryInfo } from "@/types/domain";

/**
 * NO HIDDEN PAY. Deterministic salary display rules.
 * - employer_listed and pathd_estimate must never look alike.
 * - not_provided shows "Pay not provided"; we never fill in a number.
 */

export const SALARY_SOURCE_LABEL = {
  employer_listed: "Employer listed",
  pathd_estimate: "PATHD estimate",
  not_provided: "Pay not provided",
} as const;

function compact(n: number, period: SalaryInfo["period"]): string {
  if (period === "hour") return `$${Number.isInteger(n) ? n : n.toFixed(2)}`;
  if (n >= 1000) {
    const k = n / 1000;
    return `$${Number.isInteger(k) ? k : k.toFixed(1)}K`;
  }
  return `$${n}`;
}

function full(n: number): string {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function bounds(s: SalaryInfo): [number, number] | null {
  if (s.source === "not_provided") return null;
  const lo = s.min ?? s.max;
  const hi = s.max ?? s.min;
  if (lo == null || hi == null) return null;
  return [lo, hi];
}

/** "$78K–$92K", "$32/hr", or null when pay isn't provided. */
export function formatSalaryShort(s: SalaryInfo): string | null {
  const b = bounds(s);
  if (!b) return null;
  const [lo, hi] = b;
  const suffix = s.period === "hour" ? "/hr" : "";
  const range = lo === hi ? compact(lo, s.period) : `${compact(lo, s.period)}–${compact(hi, s.period)}`;
  return range + suffix;
}

/** "$78,000–$92,000 a year" */
export function formatSalaryLong(s: SalaryInfo): string | null {
  const b = bounds(s);
  if (!b) return null;
  const [lo, hi] = b;
  const unit = s.period === "hour" ? "an hour" : "a year";
  return lo === hi ? `${full(lo)} ${unit}` : `${full(lo)}–${full(hi)} ${unit}`;
}

/** Annualized midpoint for comparisons (2,080 working hours/year). */
export function annualMidpoint(s: SalaryInfo): number | null {
  const b = bounds(s);
  if (!b) return null;
  const mid = (b[0] + b[1]) / 2;
  return s.period === "hour" ? mid * 2080 : mid;
}

/** Validates a salary record before it's stored. Throws on integrity violations. */
export function assertSalaryIntegrity(s: SalaryInfo): void {
  if (s.source === "not_provided" && (s.min != null || s.max != null)) {
    throw new Error("Salary marked not_provided must not carry numbers.");
  }
  if (s.source !== "not_provided" && s.min == null && s.max == null) {
    throw new Error("Listed or estimated salary requires at least one bound.");
  }
  if (s.source === "pathd_estimate" && !s.estimateBasis) {
    throw new Error("PATHD estimates must record their basis.");
  }
  if (s.min != null && s.max != null && s.min > s.max) {
    throw new Error("Salary min exceeds max.");
  }
}
