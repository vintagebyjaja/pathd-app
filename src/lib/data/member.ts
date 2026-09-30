import "server-only";
import type { EducationLevel, MatchProfile, WorkType } from "@/types/domain";
import { isSupabaseConfigured } from "@/lib/env";
import { DEMO_MATCH_PROFILE, DEMO_MEMBER } from "./demo/profile";

export interface CurrentMember {
  id: string;
  fullName: string;
  firstName: string;
  headline: string | null;
  currentRole: string | null;
  city: string | null;
  careerGoal: string | null;
  skills: string[];
  certifications: string[];
  licenses: string[];
  matchProfile: MatchProfile;
  isDemo: boolean;
}

export async function getCurrentMember(): Promise<CurrentMember | null> {
  if (!isSupabaseConfigured) {
    return {
      ...DEMO_MEMBER,
      skills: DEMO_MATCH_PROFILE.skills,
      certifications: DEMO_MATCH_PROFILE.certifications,
      licenses: DEMO_MATCH_PROFILE.licenses,
      matchProfile: DEMO_MATCH_PROFILE,
    };
  }

  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return null;

  const { data: p } = await sb
    .from("profiles")
    .select("id, full_name, headline, current_title, city, career_goal, years_experience, highest_education, profile_skills(skills(name)), certifications(name), licenses(name), career_preferences(*)")
    .eq("id", auth.user.id)
    .maybeSingle();
  if (!p) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const row = p as any;
  const prefs = row.career_preferences ?? {};
  const skills: string[] = (row.profile_skills ?? []).map((s: { skills: { name: string } }) => s.skills.name);
  const certifications: string[] = (row.certifications ?? []).map((c: { name: string }) => c.name);
  const licenses: string[] = (row.licenses ?? []).map((l: { name: string }) => l.name);

  return {
    id: row.id,
    fullName: row.full_name ?? "",
    firstName: (row.full_name ?? "").split(" ")[0] || "there",
    headline: row.headline,
    currentRole: row.current_title,
    city: row.city,
    careerGoal: row.career_goal,
    skills,
    certifications,
    licenses,
    isDemo: false,
    matchProfile: {
      skills,
      certifications,
      licenses,
      yearsExperience: row.years_experience ?? 0,
      educationLevel: (row.highest_education ?? "none") as EducationLevel,
      preferences: {
        desiredRoles: prefs.desired_roles ?? [],
        salaryTarget: prefs.salary_target ?? null,
        industries: prefs.industries ?? [],
        workTypes: (prefs.work_types ?? []) as WorkType[],
        commuteMiles: prefs.commute_miles ?? null,
        searchCenter: prefs.search_lat != null ? { lat: prefs.search_lat, lng: prefs.search_lng } : null,
        willingToRelocate: prefs.willing_to_relocate ?? false,
      },
    },
  };
}
