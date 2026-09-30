import type { Company, EducationLevel, ExperienceLevel, FieldId, GeoPoint, Job, PlaceType, RemoteScope, SalaryInfo, WorkType } from "@/types/domain";

/**
 * DEMO DATA — fictional companies and listings for development and previews.
 * Every record carries isDemo: true and renders with a "Sample" label.
 * None of these jobs or employers are real.
 */

const FIELD_INDUSTRY: Record<FieldId, string> = {
  health: "Healthcare",
  stem: "Technology",
  mba: "Business Strategy",
  acct: "Accounting",
  fin: "Finance",
  biz: "Business",
  hr: "Human Resources",
  rec: "Recruiting",
  hosp: "Hospitality",
  cons: "Construction",
  design: "Design",
  fashion: "Fashion",
};

const companies = new Map<string, Company>();
function co(name: string, field: FieldId): Company {
  const slug = name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const existing = companies.get(slug);
  if (existing) return existing;
  const c: Company = { id: `co_${slug}`, slug, name, industry: FIELD_INDUSTRY[field], isDemo: true };
  companies.set(slug, c);
  return c;
}

const listed = (min: number, max: number, period: SalaryInfo["period"] = "year"): SalaryInfo => ({ source: "employer_listed", min, max, period, currency: "USD" });
const estimate = (min: number, max: number): SalaryInfo => ({
  source: "pathd_estimate",
  min,
  max,
  period: "year",
  currency: "USD",
  estimateBasis: "Sample estimate from regional pay data for similar roles",
});
const noPay: SalaryInfo = { source: "not_provided", min: null, max: null, period: "year", currency: "USD" };

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

interface Seed {
  id: string;
  title: string;
  company: string;
  field: FieldId;
  place: PlaceType;
  where: [string, string, GeoPoint | null];
  salary: SalaryInfo;
  work: WorkType;
  remote?: RemoteScope;
  level: ExperienceLevel;
  years: number;
  edu: EducationLevel;
  skills: string[];
  nice?: string[];
  licenses?: string[];
  certs?: string[];
  posted: number; // hours ago
  about: string;
  external?: boolean;
}

const CLT = "Charlotte";
const pt = (lat: number, lng: number): GeoPoint => ({ lat, lng });

const SEEDS: Seed[] = [
  // Healthcare & Nursing
  { id: "demo_001", title: "Registered Nurse, Med-Surg", company: "Tidewell Health", field: "health", place: "hospital", where: [CLT, "NC", pt(35.2045, -80.825)], salary: listed(38, 52, "hour"), work: "onsite", level: "mid", years: 1, edu: "associate", skills: ["Patient Care", "EHR"], licenses: ["RN license"], certs: ["BLS"], posted: 6, about: "Care for patients on a 32-bed medical-surgical unit. Three 12-hour shifts a week." },
  { id: "demo_002", title: "ICU Registered Nurse", company: "Tidewell Health University", field: "health", place: "hospital", where: [CLT, "NC", pt(35.3035, -80.742)], salary: listed(42, 58, "hour"), work: "onsite", level: "mid", years: 2, edu: "bachelor", skills: ["Critical Care", "Patient Care", "EHR"], licenses: ["RN license"], certs: ["ACLS", "BLS"], posted: 2, about: "Join a 24-bed ICU with a strong preceptor program." },
  { id: "demo_003", title: "Charge Nurse, Emergency Dept.", company: "Cabarrus Valley Medical", field: "health", place: "hospital", where: ["Concord", "NC", pt(35.412, -80.583)], salary: listed(46, 60, "hour"), work: "onsite", level: "senior", years: 4, edu: "bachelor", skills: ["Emergency Care", "Team Leadership", "Triage"], licenses: ["RN license"], certs: ["CEN", "ACLS"], posted: 1, about: "Lead shift operations in a Level II emergency department." },
  { id: "demo_004", title: "Nurse Practitioner, Primary Care", company: "Brightwater Family Medicine", field: "health", place: "clinic", where: [CLT, "NC", pt(35.054, -80.848)], salary: listed(118000, 135000), work: "onsite", level: "senior", years: 2, edu: "master", skills: ["Primary Care", "Patient Care"], licenses: ["NP license"], posted: 30, about: "Provide primary care to adult and family patients in a growing practice." },
  { id: "demo_005", title: "Physical Therapist", company: "Motion Lab Rehab", field: "health", place: "clinic", where: [CLT, "NC", pt(35.156, -80.823)], salary: listed(85000, 98000), work: "onsite", level: "mid", years: 1, edu: "doctorate", skills: ["Orthopedics", "Treatment Planning"], licenses: ["PT license"], posted: 50, about: "Outpatient orthopedic and sports rehab." },
  { id: "demo_006", title: "Medical Assistant", company: "Northlake Pediatrics", field: "health", place: "clinic", where: ["Huntersville", "NC", pt(35.395, -80.848)], salary: listed(19, 23, "hour"), work: "onsite", level: "entry", years: 0, edu: "high_school", skills: ["Vitals", "Scheduling"], certs: ["CMA"], posted: 20, about: "Support a busy pediatric office with intake and scheduling." },
  // STEM & Tech
  { id: "demo_007", title: "Software Engineer II", company: "Quarry Labs", field: "stem", place: "loft", where: [CLT, "NC", pt(35.212, -80.859)], salary: listed(105000, 130000), work: "hybrid", level: "mid", years: 3, edu: "bachelor", skills: ["TypeScript", "React", "SQL"], nice: ["AWS"], posted: 4, about: "Build product features for a B2B analytics platform." },
  { id: "demo_008", title: "Data Analyst", company: "Lumen Grid Energy", field: "stem", place: "tower", where: [CLT, "NC", pt(35.229, -80.846)], salary: listed(78000, 92000), work: "hybrid", level: "mid", years: 2, edu: "bachelor", skills: ["SQL", "Excel", "Tableau"], nice: ["Python"], posted: 15, about: "Turn grid and customer data into reporting for operations leaders." },
  { id: "demo_009", title: "Cybersecurity Analyst", company: "Ironbark Security", field: "stem", place: "lowoffice", where: [CLT, "NC", pt(35.06, -80.856)], salary: listed(95000, 115000), work: "hybrid", level: "mid", years: 3, edu: "bachelor", skills: ["SIEM", "Incident Response"], certs: ["Security+"], posted: 9, about: "Monitor, investigate and respond to security events for client networks." },
  { id: "demo_010", title: "Civil Engineer EIT", company: "Meridian Span Engineering", field: "stem", place: "lowoffice", where: ["Matthews", "NC", pt(35.118, -80.724)], salary: listed(72000, 84000), work: "hybrid", level: "entry", years: 0, edu: "bachelor", skills: ["AutoCAD", "Civil 3D"], certs: ["EIT"], posted: 40, about: "Design site and roadway improvements under PE supervision." },
  // MBA & Strategy
  { id: "demo_011", title: "Strategy Manager (MBA preferred)", company: "Northstar Consumer Group", field: "mba", place: "tower", where: [CLT, "NC", pt(35.151, -80.827)], salary: listed(125000, 150000), work: "hybrid", level: "senior", years: 5, edu: "master", skills: ["Strategy", "Financial Modeling", "Executive Communication"], posted: 26, about: "Shape growth strategy for a portfolio of consumer brands." },
  { id: "demo_012", title: "Senior Product Manager", company: "Fieldnote Software", field: "mba", place: "tower", where: ["Remote", "USA", null], salary: listed(135000, 160000), work: "remote", remote: "usa", level: "senior", years: 5, edu: "bachelor", skills: ["Product Strategy", "Roadmapping", "User Research"], posted: 12, about: "Own the roadmap for a workflow product used by small businesses." },
  // Accounting
  { id: "demo_013", title: "Staff Accountant", company: "Harrow & Pine CPAs", field: "acct", place: "tower", where: [CLT, "NC", pt(35.147, -80.835)], salary: listed(62000, 72000), work: "hybrid", level: "entry", years: 1, edu: "bachelor", skills: ["GAAP", "Reconciliations", "Excel"], posted: 33, about: "Month-end close and reconciliations for small and mid-size clients." },
  { id: "demo_014", title: "Senior Tax Accountant, CPA", company: "Harrow & Pine CPAs", field: "acct", place: "tower", where: [CLT, "NC", pt(35.225, -80.84)], salary: listed(88000, 105000), work: "hybrid", level: "senior", years: 4, edu: "bachelor", skills: ["Tax Preparation", "Tax Research"], licenses: ["CPA license"], posted: 7, about: "Prepare and review business and individual returns." },
  // Finance
  { id: "demo_015", title: "Financial Analyst", company: "Brightledger Financial", field: "fin", place: "tower", where: [CLT, "NC", pt(35.228, -80.842)], salary: listed(72000, 85000), work: "hybrid", level: "mid", years: 2, edu: "bachelor", skills: ["Excel", "Financial Modeling"], nice: ["SQL"], posted: 50, about: "Forecasting and variance reporting for regional operations." },
  { id: "demo_016", title: "Credit Risk Analyst", company: "Carolina Crest Bank", field: "fin", place: "tower", where: [CLT, "NC", pt(35.05, -80.841)], salary: listed(90000, 110000), work: "hybrid", level: "mid", years: 3, edu: "bachelor", skills: ["Credit Analysis", "SQL", "Excel"], posted: 3, about: "Assess commercial credit risk and build portfolio monitoring reports." },
  // Business
  { id: "demo_017", title: "Operations Manager", company: "Hollowell Logistics", field: "biz", place: "warehouse", where: [CLT, "NC", pt(35.214, -80.943)], salary: listed(80000, 95000), work: "onsite", level: "senior", years: 4, edu: "bachelor", skills: ["Operations", "Team Leadership", "Lean"], posted: 18, about: "Run day-to-day operations for a regional distribution center." },
  { id: "demo_018", title: "Business Development Rep", company: "Quarry Labs", field: "biz", place: "loft", where: [CLT, "NC", pt(35.247, -80.806)], salary: listed(55000, 65000), work: "hybrid", level: "entry", years: 0, edu: "bachelor", skills: ["Prospecting", "CRM"], posted: 22, about: "Open conversations with mid-market companies. Base pay shown; commission is extra." },
  // HR
  { id: "demo_019", title: "HR Generalist", company: "Pinecrest Manufacturing", field: "hr", place: "warehouse", where: ["Mint Hill", "NC", pt(35.18, -80.648)], salary: listed(62000, 72000), work: "onsite", level: "mid", years: 2, edu: "bachelor", skills: ["Employee Relations", "Benefits", "HRIS"], certs: ["SHRM-CP"], posted: 44, about: "Partner with plant leaders on hiring, onboarding and employee relations." },
  { id: "demo_020", title: "HR Business Partner", company: "Brightledger Financial", field: "hr", place: "tower", where: [CLT, "NC", pt(35.221, -80.808)], salary: listed(95000, 112000), work: "hybrid", level: "senior", years: 5, edu: "bachelor", skills: ["Employee Relations", "Talent Planning"], certs: ["SHRM-SCP"], posted: 28, about: "Advise business leaders on talent, performance and organization design." },
  // Recruiting
  { id: "demo_021", title: "Technical Recruiter", company: "Talentfield Partners", field: "rec", place: "loft", where: [CLT, "NC", pt(35.208, -80.863)], salary: listed(70000, 85000), work: "hybrid", level: "mid", years: 2, edu: "bachelor", skills: ["Sourcing", "Interviewing", "ATS"], posted: 10, about: "Recruit engineers and data talent for growing tech clients." },
  { id: "demo_022", title: "Healthcare Recruiter", company: "Kindred Path Staffing", field: "rec", place: "lowoffice", where: ["Remote", "USA", null], salary: noPay, work: "remote", remote: "usa", level: "mid", years: 2, edu: "bachelor", skills: ["Sourcing", "Healthcare Staffing"], posted: 16, about: "Place nurses and allied health professionals with partner hospitals.", external: true },
  // Hospitality
  { id: "demo_023", title: "Hotel Front Office Manager", company: "Saltbox Hotels", field: "hosp", place: "hotel", where: [CLT, "NC", pt(35.2255, -80.849)], salary: listed(58000, 66000), work: "onsite", level: "mid", years: 3, edu: "associate", skills: ["Guest Services", "Team Leadership"], posted: 5, about: "Lead the front desk team at a 180-room uptown hotel." },
  { id: "demo_024", title: "Event Sales Manager", company: "Riverbend Conference Center", field: "hosp", place: "hotel", where: ["Fort Mill", "SC", pt(35.007, -80.945)], salary: estimate(60000, 72000), work: "onsite", level: "mid", years: 3, edu: "bachelor", skills: ["Event Sales", "Negotiation"], posted: 36, about: "Book corporate and social events for a 40,000 sq ft venue." },
  // Construction
  { id: "demo_025", title: "Assistant Project Manager", company: "Hollis Build Group", field: "cons", place: "site", where: [CLT, "NC", pt(35.305, -80.73)], salary: listed(70000, 84000), work: "onsite", level: "mid", years: 2, edu: "bachelor", skills: ["Procore", "Scheduling", "Submittals"], posted: 9, about: "Support ground-up commercial projects from preconstruction to closeout." },
  { id: "demo_026", title: "Construction Superintendent", company: "Hollis Build Group", field: "cons", place: "site", where: ["Gastonia", "NC", pt(35.262, -81.187)], salary: listed(95000, 115000), work: "onsite", level: "senior", years: 7, edu: "high_school", skills: ["Site Safety", "Scheduling", "Subcontractor Management"], certs: ["OSHA 30"], posted: 60, about: "Run the jobsite for a new medical office building." },
  // Design
  { id: "demo_027", title: "Project Designer", company: "Ferncourt Studio", field: "design", place: "loft", where: [CLT, "NC", pt(35.205, -80.851)], salary: listed(78000, 92000), work: "hybrid", level: "mid", years: 5, edu: "bachelor", skills: ["Revit", "Construction Documents", "Design Development"], nice: ["Rhino", "Enscape"], certs: ["LEED AP"], posted: 2, about: "Lead design development and documents for higher-education projects." },
  { id: "demo_028", title: "Interior Designer", company: "Lantern & Vale", field: "design", place: "loft", where: [CLT, "NC", pt(35.223, -80.804)], salary: listed(60000, 74000), work: "hybrid", level: "mid", years: 3, edu: "bachelor", skills: ["Space Planning", "AutoCAD", "Finish Selection"], posted: 27, about: "Workplace and hospitality interiors from concept through installation." },
  { id: "demo_029", title: "Senior Product Designer", company: "Quarry Labs", field: "design", place: "loft", where: ["Remote", "USA", null], salary: listed(120000, 145000), work: "remote", remote: "usa", level: "senior", years: 5, edu: "bachelor", skills: ["Figma", "Interaction Design", "User Research"], posted: 30, about: "Design end-to-end flows for a B2B analytics product." },
  // Fashion
  { id: "demo_030", title: "Assistant Buyer", company: "Halden & Rye", field: "fashion", place: "store", where: [CLT, "NC", pt(35.153, -80.833)], salary: listed(58000, 68000), work: "onsite", level: "entry", years: 1, edu: "bachelor", skills: ["Merchandise Planning", "Excel", "Vendor Relations"], posted: 14, about: "Support buying for women's ready-to-wear across 12 stores." },
  { id: "demo_031", title: "Visual Merchandising Manager", company: "Halden & Rye", field: "fashion", place: "store", where: ["Huntersville", "NC", pt(35.362, -80.856)], salary: listed(55000, 65000), work: "onsite", level: "mid", years: 3, edu: "associate", skills: ["Visual Merchandising", "Team Leadership"], posted: 48, about: "Own windows, floor sets and brand presentation for a flagship store." },
  { id: "demo_032", title: "Product Developer, Apparel", company: "Stitchline Studio", field: "fashion", place: "loft", where: ["Remote", "USA", null], salary: listed(70000, 85000), work: "remote", remote: "usa", level: "mid", years: 3, edu: "bachelor", skills: ["Tech Packs", "Fit", "Vendor Relations"], posted: 20, about: "Take apparel from sketch to production with overseas partners." },
];

export const DEMO_JOBS: Job[] = SEEDS.map((s) => ({
  id: s.id,
  title: s.title,
  company: co(s.company, s.field),
  industry: FIELD_INDUSTRY[s.field],
  description: s.about,
  salary: s.salary,
  workType: s.work,
  remoteScope: s.remote ?? null,
  location: { city: s.where[0], region: s.where[1], point: s.where[2] },
  experienceLevel: s.level,
  minYearsExperience: s.years,
  educationLevel: s.edu,
  requiredSkills: s.skills,
  preferredSkills: s.nice ?? [],
  requiredLicenses: s.licenses ?? [],
  preferredCertifications: s.certs ?? [],
  postedAt: hoursAgo(s.posted),
  applyMethod: s.external ? "external" : "pathd",
  applyUrl: null,
  source: "demo",
  isDemo: true,
  field: s.field,
  place: s.place,
}));

export const DEMO_COMPANIES: Company[] = [...companies.values()];
