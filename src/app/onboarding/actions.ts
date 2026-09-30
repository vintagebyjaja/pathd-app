"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { ParsedResumeSchema } from "@/lib/ai/provider";
import { isSupabaseConfigured } from "@/lib/env";

const Vis = z.enum(["public", "connections", "private"]);

const DraftSchema = z.object({
  purposes: z.array(z.enum(["find_job", "advance_career", "explore_careers", "build_network", "pursue_licensure", "find_study_group", "connect_major", "find_wellness", "hire_talent"])).min(1),
  resume: ParsedResumeSchema,
  preferences: z.object({
    desiredRoles: z.array(z.string().max(120)).max(20),
    salaryTarget: z.number().int().positive().max(5_000_000).nullable(),
    industries: z.array(z.string().max(80)).max(20),
    workTypes: z.array(z.enum(["remote", "hybrid", "onsite"])),
    commuteMiles: z.number().int().positive().max(200).nullable(),
    preferredLocations: z.array(z.string().max(120)).max(20),
    willingToRelocate: z.boolean(),
  }),
  privacy: z.object({
    profile: Vis,
    currentEmployer: Vis,
    jobSeekingStatus: Vis,
    locationPrecision: z.enum(["city", "region", "hidden"]),
    circles: Vis,
    connections: Vis,
    activity: Vis,
  }),
});

export async function saveOnboarding(raw: unknown): Promise<{ error?: string }> {
  const parsed = DraftSchema.safeParse(raw);
  if (!parsed.success) return { error: "Some answers need attention. Choose at least one purpose and check your details." };
  if (!isSupabaseConfigured) redirect("/home?welcome=demo");

  const d = parsed.data;
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) redirect("/sign-in?next=/onboarding");
  const uid = auth.user.id;

  // One RPC keeps the whole save atomic; see supabase/migrations/0001_phase1.sql.
  const { error } = await sb.rpc("complete_onboarding", {
    p_user_id: uid,
    p_payload: {
      purposes: d.purposes,
      profile: { full_name: d.resume.fullName, headline: d.resume.headline, city: d.resume.location },
      work: d.resume.workExperience,
      education: d.resume.education,
      skills: d.resume.skills,
      certifications: d.resume.certifications,
      licenses: d.resume.licenses,
      portfolio_links: d.resume.portfolioLinks,
      preferences: {
        desired_roles: d.preferences.desiredRoles,
        salary_target: d.preferences.salaryTarget,
        industries: d.preferences.industries,
        work_types: d.preferences.workTypes,
        commute_miles: d.preferences.commuteMiles,
        preferred_locations: d.preferences.preferredLocations,
        willing_to_relocate: d.preferences.willingToRelocate,
      },
      privacy: {
        profile: d.privacy.profile,
        current_employer: d.privacy.currentEmployer,
        job_seeking_status: d.privacy.jobSeekingStatus,
        location_precision: d.privacy.locationPrecision,
        circles: d.privacy.circles,
        connections: d.privacy.connections,
        activity: d.privacy.activity,
      },
    },
  });
  if (error) return { error: "We couldn't save your profile. Try again." };
  redirect("/home?welcome=1");
}
