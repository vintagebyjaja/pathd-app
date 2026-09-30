import type { EducationLevel, Job, MatchCriterion, MatchProfile, MatchResult } from "@/types/domain";
import { annualMidpoint, formatSalaryShort } from "@/lib/salary/format";
import { formatMiles, milesBetween } from "@/lib/geo/distance";

/**
 * PATHD Match — deterministic, explainable scoring.
 *
 * Every percentage is the weighted average of the criteria below, and every
 * criterion is returned so the UI can show exactly why someone matches.
 *
 * FAIRNESS: this function only reads job-relevant, structured fields. It never
 * receives or uses race, religion, sex, sexual orientation, disability, age,
 * or any other protected characteristic. Do not add such inputs.
 */

export const MATCH_WEIGHTS = {
  skills: 30,
  experience: 15,
  education: 10,
  licenses: 10,
  certifications: 5,
  location: 10,
  salary: 10,
  work_type: 5,
  industry: 5,
} as const;

const EDUCATION_RANK: Record<EducationLevel, number> = {
  none: 0,
  high_school: 1,
  associate: 2,
  bachelor: 3,
  master: 4,
  doctorate: 5,
};

const EDUCATION_LABEL: Record<EducationLevel, string> = {
  none: "No degree required",
  high_school: "High school diploma",
  associate: "Associate degree",
  bachelor: "Bachelor's degree",
  master: "Master's degree",
  doctorate: "Doctorate",
};

const norm = (s: string) => s.trim().toLowerCase();

function statusFor(fraction: number): MatchCriterion["status"] {
  if (fraction >= 0.999) return "met";
  if (fraction > 0) return "partial";
  return "missing";
}

function skillsCriterion(job: Job, have: Set<string>): MatchCriterion | null {
  const req = job.requiredSkills;
  const pref = job.preferredSkills;
  if (req.length === 0 && pref.length === 0) return null;
  const reqHit = req.filter((s) => have.has(norm(s)));
  const prefHit = pref.filter((s) => have.has(norm(s)));
  const reqFrac = req.length ? reqHit.length / req.length : 1;
  const prefFrac = pref.length ? prefHit.length / pref.length : 1;
  const fraction = pref.length ? reqFrac * 0.8 + prefFrac * 0.2 : reqFrac;
  const missing = req.filter((s) => !have.has(norm(s)));
  return {
    key: "skills",
    label: "Skills",
    status: statusFor(fraction),
    detail:
      missing.length === 0
        ? `All ${req.length} required skills`
        : `${reqHit.length} of ${req.length} required skills. Missing: ${missing.join(", ")}`,
    weight: MATCH_WEIGHTS.skills,
    fraction,
  };
}

function experienceCriterion(job: Job, years: number): MatchCriterion {
  const min = job.minYearsExperience;
  let fraction = 1;
  if (min > 0 && years < min) fraction = years >= min - 1 ? 0.6 : Math.max(0, years / min) * 0.5;
  return {
    key: "experience",
    label: "Experience",
    status: statusFor(fraction),
    detail: min === 0 ? "No minimum experience" : `${min}+ years asked; you have ${years}`,
    weight: MATCH_WEIGHTS.experience,
    fraction,
  };
}

function educationCriterion(job: Job, level: EducationLevel): MatchCriterion {
  const need = EDUCATION_RANK[job.educationLevel];
  const have = EDUCATION_RANK[level];
  const fraction = have >= need ? 1 : have === need - 1 ? 0.5 : 0;
  return {
    key: "education",
    label: "Education",
    status: statusFor(fraction),
    detail: EDUCATION_LABEL[job.educationLevel],
    weight: MATCH_WEIGHTS.education,
    fraction,
  };
}

function listCriterion(
  key: "licenses" | "certifications",
  label: string,
  wanted: string[],
  have: Set<string>,
  requiredWording: string,
): MatchCriterion | null {
  if (wanted.length === 0) return null;
  const hit = wanted.filter((w) => have.has(norm(w)));
  const fraction = hit.length / wanted.length;
  const missing = wanted.filter((w) => !have.has(norm(w)));
  return {
    key,
    label,
    status: statusFor(fraction),
    detail: missing.length === 0 ? wanted.join(", ") : `${missing.join(", ")} ${requiredWording}`,
    weight: MATCH_WEIGHTS[key],
    fraction,
  };
}

function locationCriterion(job: Job, p: MatchProfile): MatchCriterion | null {
  if (job.workType === "remote") {
    return { key: "location", label: "Location", status: "met", detail: "Remote role", weight: MATCH_WEIGHTS.location, fraction: 1 };
  }
  const center = p.preferences.searchCenter;
  const radius = p.preferences.commuteMiles;
  if (!center || !job.location.point || radius == null) return null;
  const miles = milesBetween(center, job.location.point);
  let fraction = miles <= radius ? 1 : miles <= radius * 1.5 ? 0.5 : 0;
  if (fraction === 0 && p.preferences.willingToRelocate) fraction = 0.4;
  return {
    key: "location",
    label: "Commute",
    status: statusFor(fraction),
    detail: `${formatMiles(miles)} (your limit is ${radius} miles)`,
    weight: MATCH_WEIGHTS.location,
    fraction,
  };
}

function salaryCriterion(job: Job, target: number | null): MatchCriterion | null {
  if (target == null) return null;
  const shown = formatSalaryShort(job.salary);
  if (!shown) {
    // No pay info: shown for transparency but never scored up or down.
    return { key: "salary", label: "Pay", status: "partial", detail: "Pay not provided", weight: 0, fraction: 0 };
  }
  const top = job.salary.period === "hour" ? (job.salary.max ?? job.salary.min ?? 0) * 2080 : (job.salary.max ?? job.salary.min ?? 0);
  const mid = annualMidpoint(job.salary) ?? 0;
  const fraction = mid >= target ? 1 : top >= target ? 0.8 : top >= target * 0.9 ? 0.5 : 0;
  return {
    key: "salary",
    label: "Pay",
    status: statusFor(fraction),
    detail: `${shown} vs your $${Math.round(target / 1000)}K target`,
    weight: MATCH_WEIGHTS.salary,
    fraction,
  };
}

export function scoreMatch(job: Job, profile: MatchProfile): MatchResult {
  const skillSet = new Set(profile.skills.map(norm));
  const prefs = profile.preferences;

  const criteria = [
    skillsCriterion(job, skillSet),
    experienceCriterion(job, profile.yearsExperience),
    educationCriterion(job, profile.educationLevel),
    listCriterion("licenses", "Licensure", job.requiredLicenses, new Set(profile.licenses.map(norm)), "required"),
    listCriterion("certifications", "Certifications", job.preferredCertifications, new Set(profile.certifications.map(norm)), "preferred"),
    locationCriterion(job, profile),
    salaryCriterion(job, prefs.salaryTarget),
    prefs.workTypes.length
      ? {
          key: "work_type" as const,
          label: "Work style",
          status: prefs.workTypes.includes(job.workType) ? ("met" as const) : ("missing" as const),
          detail: job.workType === "onsite" ? "In person" : job.workType[0]!.toUpperCase() + job.workType.slice(1),
          weight: MATCH_WEIGHTS.work_type,
          fraction: prefs.workTypes.includes(job.workType) ? 1 : 0,
        }
      : null,
    prefs.industries.length
      ? {
          key: "industry" as const,
          label: "Industry",
          status: prefs.industries.map(norm).includes(norm(job.industry)) ? ("met" as const) : ("partial" as const),
          detail: job.industry,
          weight: MATCH_WEIGHTS.industry,
          fraction: prefs.industries.map(norm).includes(norm(job.industry)) ? 1 : 0.5,
        }
      : null,
  ].filter((c): c is MatchCriterion => c !== null);

  const totalWeight = criteria.reduce((a, c) => a + c.weight, 0);
  const earned = criteria.reduce((a, c) => a + c.weight * c.fraction, 0);
  const score = totalWeight === 0 ? 0 : Math.round((earned / totalWeight) * 100);
  return { score, criteria };
}
