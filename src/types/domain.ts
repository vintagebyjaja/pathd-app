/**
 * Core PATHD domain types. These mirror the Postgres schema in
 * supabase/migrations/0001_phase1.sql. Keep the two in sync.
 */

export type SalarySource = "employer_listed" | "pathd_estimate" | "not_provided";
export type SalaryPeriod = "year" | "hour";

export interface SalaryInfo {
  source: SalarySource;
  /** Whole currency units. Null only when source is "not_provided". */
  min: number | null;
  max: number | null;
  period: SalaryPeriod;
  currency: "USD";
  /** Required when source is "pathd_estimate": where the estimate came from. */
  estimateBasis?: string;
}

export type WorkType = "remote" | "hybrid" | "onsite";
export type RemoteScope = "usa" | "worldwide" | null;
export type EducationLevel = "none" | "high_school" | "associate" | "bachelor" | "master" | "doctorate";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead" | "executive";

export interface GeoPoint {
  lat: number;
  lng: number;
}

export interface Company {
  id: string;
  slug: string;
  name: string;
  industry: string;
  isDemo: boolean;
}

/** Career fields shown across PATHD (see src/lib/explore/fields.ts). */
export type FieldId = "health" | "stem" | "mba" | "acct" | "fin" | "biz" | "hr" | "rec" | "hosp" | "cons" | "design" | "fashion";

/** Kind of workplace, used for the illustration shown until an employer uploads photos. */
export type PlaceType = "hospital" | "clinic" | "tower" | "lowoffice" | "loft" | "hotel" | "site" | "store" | "warehouse";

export interface Job {
  id: string;
  title: string;
  company: Company;
  industry: string;
  description: string;
  salary: SalaryInfo;
  workType: WorkType;
  remoteScope: RemoteScope;
  /** Public job location (office), never a person's home. */
  location: { city: string; region: string; point: GeoPoint | null };
  experienceLevel: ExperienceLevel;
  minYearsExperience: number;
  educationLevel: EducationLevel;
  requiredSkills: string[];
  preferredSkills: string[];
  requiredLicenses: string[];
  preferredCertifications: string[];
  postedAt: string; // ISO
  applyMethod: "pathd" | "external";
  applyUrl: string | null;
  source: string;
  isDemo: boolean;
  field?: FieldId;
  place?: PlaceType;
}

export interface CareerPreferences {
  desiredRoles: string[];
  /** Minimum annual pay for the next job. Owner-only; employers see only a fit signal. */
  salaryTarget: number | null;
  industries: string[];
  workTypes: WorkType[];
  commuteMiles: number | null;
  /** Approximate, user-approved search center. Never a home address. */
  searchCenter: GeoPoint | null;
  willingToRelocate: boolean;
}

export interface MatchProfile {
  skills: string[];
  yearsExperience: number;
  educationLevel: EducationLevel;
  certifications: string[];
  licenses: string[];
  preferences: CareerPreferences;
}

export type CriterionStatus = "met" | "partial" | "missing";

export interface MatchCriterion {
  key: "skills" | "experience" | "education" | "licenses" | "certifications" | "location" | "salary" | "work_type" | "industry";
  label: string;
  status: CriterionStatus;
  detail: string;
  weight: number;
  /** 0..1 */
  fraction: number;
}

export interface MatchResult {
  score: number; // 0..100
  criteria: MatchCriterion[];
}

export type Purpose =
  | "find_job"
  | "advance_career"
  | "explore_careers"
  | "build_network"
  | "pursue_licensure"
  | "find_study_group"
  | "connect_major"
  | "find_wellness"
  | "hire_talent";

export type Visibility = "public" | "connections" | "private";

/**
 * Pay is never a visibility option: current pay is never collected, and the
 * minimum pay target is visible only to its owner. See PRODUCT_SPEC "Your pay is yours".
 */
export interface PrivacySettings {
  profile: Visibility;
  currentEmployer: Visibility;
  jobSeekingStatus: Visibility;
  locationPrecision: "city" | "region" | "hidden";
  circles: Visibility;
  connections: Visibility;
  activity: Visibility;
}
