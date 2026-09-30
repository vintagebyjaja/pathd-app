import type { MatchProfile } from "@/types/domain";

/** DEMO DATA — fictional member used when Supabase isn't configured. */
export const DEMO_MEMBER = {
  id: "demo_member",
  fullName: "Jordan Reyes",
  firstName: "Jordan",
  headline: "Architectural Designer focused on higher-education work",
  currentRole: "Architectural Designer",
  currentCompany: "Private (hidden)",
  city: "Charlotte, NC",
  careerGoal: "Design Manager",
  isDemo: true,
};

export const DEMO_MATCH_PROFILE: MatchProfile = {
  skills: ["Revit", "Construction Documents", "Design Development", "Rhino", "Enscape", "AutoCAD"],
  yearsExperience: 6,
  educationLevel: "master",
  certifications: [],
  licenses: [],
  preferences: {
    desiredRoles: ["Project Designer", "Project Architect"],
    salaryTarget: 85000,
    industries: ["Design"],
    workTypes: ["hybrid", "onsite"],
    commuteMiles: 15,
    // City-level approximate center (uptown Charlotte), not a residence.
    searchCenter: { lat: 35.22, lng: -80.84 },
    willingToRelocate: false,
  },
};
