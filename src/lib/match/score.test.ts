import { describe, expect, it } from "vitest";
import { scoreMatch } from "./score";
import type { Job, MatchProfile } from "@/types/domain";

const baseJob: Job = {
  id: "t1",
  title: "Project Designer",
  company: { id: "c1", slug: "demo", name: "Demo Studio", industry: "Architecture", isDemo: true },
  industry: "Architecture",
  description: "",
  salary: { source: "employer_listed", min: 78000, max: 92000, period: "year", currency: "USD" },
  workType: "hybrid",
  remoteScope: null,
  location: { city: "Charlotte", region: "NC", point: { lat: 35.227, lng: -80.843 } },
  experienceLevel: "mid",
  minYearsExperience: 5,
  educationLevel: "bachelor",
  requiredSkills: ["Revit", "Construction Documents"],
  preferredSkills: ["Rhino"],
  requiredLicenses: [],
  preferredCertifications: ["LEED AP"],
  postedAt: new Date().toISOString(),
  applyMethod: "pathd",
  applyUrl: null,
  source: "demo",
  isDemo: true,
};

const profile: MatchProfile = {
  skills: ["revit", "Construction Documents", "Rhino"],
  yearsExperience: 6,
  educationLevel: "master",
  certifications: [],
  licenses: [],
  preferences: {
    desiredRoles: ["Project Designer"],
    salaryTarget: 85000,
    industries: ["Architecture"],
    workTypes: ["hybrid"],
    commuteMiles: 20,
    searchCenter: { lat: 35.22, lng: -80.84 },
    willingToRelocate: false,
  },
};

describe("scoreMatch", () => {
  it("scores a strong fit highly and explains the gap", () => {
    const r = scoreMatch(baseJob, profile);
    expect(r.score).toBeGreaterThan(85);
    expect(r.criteria.find((c) => c.key === "certifications")?.status).toBe("missing");
  });

  it("never scores pay when pay is not provided", () => {
    const r = scoreMatch({ ...baseJob, salary: { source: "not_provided", min: null, max: null, period: "year", currency: "USD" } }, profile);
    const pay = r.criteria.find((c) => c.key === "salary");
    expect(pay?.weight).toBe(0);
    expect(pay?.detail).toBe("Pay not provided");
  });

  it("flags a missing required license", () => {
    const r = scoreMatch({ ...baseJob, requiredLicenses: ["Architectural license"] }, profile);
    expect(r.criteria.find((c) => c.key === "licenses")?.status).toBe("missing");
  });
});
