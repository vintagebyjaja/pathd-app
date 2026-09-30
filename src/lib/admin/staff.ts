import "server-only";
import { isSupabaseConfigured } from "@/lib/env";

export type StaffRole = "founder" | "team";

export interface Viewer {
  signedIn: boolean;
  staff: { id: string; role: StaffRole } | null;
}

/**
 * Who is looking at a staff page. Checked on the server for every request;
 * nothing from the client is trusted.
 */
export async function getViewer(): Promise<Viewer> {
  if (!isSupabaseConfigured) {
    // Demo mode has no accounts. Staff pages stay closed unless explicitly
    // enabled for local development. Never set this on a deployed site.
    const preview = process.env.PATHD_LOCAL_STAFF_PREVIEW === "1" && process.env.NODE_ENV !== "production";
    return { signedIn: preview, staff: preview ? { id: "local-preview", role: "founder" } : null };
  }
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const sb = await createSupabaseServerClient();
  const { data: auth } = await sb.auth.getUser();
  if (!auth.user) return { signedIn: false, staff: null };
  const { data } = await sb.from("staff_members").select("role").eq("profile_id", auth.user.id).maybeSingle();
  return { signedIn: true, staff: data ? { id: auth.user.id, role: data.role as StaffRole } : null };
}

/** Where to send someone who isn't staff: their dashboard if signed in, otherwise home. */
export function rerouteDestination(v: Viewer): { href: string; label: string } {
  return v.signedIn ? { href: "/home", label: "your dashboard" } : { href: "/", label: "the PATHD home page" };
}

/**
 * Mission Control snapshot. Staff-only: imported solely by /admin pages,
 * which check getViewer() and reroute non-staff first. Replace with live data from ops_snapshots
 * (CI, Netlify, Supabase) once deployed.
 */

export type FeatureStatus = "done" | "partial" | "design" | "todo";
export type CheckStatus = "pass" | "unverified";
export type ServiceStatus = "live" | "off" | "blocked";

export const SNAPSHOT_DATE = "September 25, 2026";

export const PHASES: { n: number; name: string; items: [string, FeatureStatus, string][] }[] = [
  { n: 1, name: "Foundation", items: [
    ["Brand and design system", "done", "Colors, type, flat logo mark, updated logo"],
    ["Landing page", "done", "Fields, map, community, pricing, pay privacy"],
    ["Sign in and sign up", "partial", "Works once Supabase is connected"],
    ["Onboarding (5 steps)", "done", "Purposes, resume, review, preferences, privacy"],
    ["Resume upload and reading", "partial", "Automatic reading needs an Anthropic key"],
    ["PATHD Profile", "done", ""],
    ["Portfolio portal (PDF, 25 MB)", "partial", "Built; works once Supabase is connected"],
    ["Job database", "done", "Schema, security rules, labeled sample jobs"],
    ["Job search and filters", "done", ""],
    ["Salary-first job cards", "done", ""],
    ["PATHD Match", "done", "Explained, protected traits excluded, tested"],
    ["Pay privacy", "done", "No current pay; minimum pay owner-only"],
    ["Staff-only access", "done", "Founders and PATHD Team; others are rerouted"],
    ["Field-level profile privacy", "partial", ""],
    ["Account deletion and data export", "todo", "Required before launch"],
    ["Accessibility audit", "todo", ""],
  ]},
  { n: 2, name: "Discovery", items: [
    ["PATHD Map", "partial", "Live with an illustrated map; real streets need Mapbox"],
    ["Commute distances", "done", "Home plus a place that matters, radius filter"],
    ["PATHD Cloud", "partial", ""],
    ["Swipe", "design", ""],
    ["Save, pass and apply", "todo", ""],
    ["Applications tracker", "design", ""],
    ["Saved jobs (hearts)", "done", "Saved on the device; moves to accounts later"],
  ]},
  { n: 3, name: "Career GPS", items: [
    ["Routes", "design", ""], ["Waypoints and readiness", "design", ""], ["Radar alerts", "design", ""], ["Skill gaps", "todo", ""],
  ]},
  { n: 4, name: "Network and Circles", items: [
    ["Connections", "todo", ""], ["Messaging", "todo", ""], ["Circles and study groups", "design", ""], ["Licensure pathways", "todo", ""], ["Student communities", "todo", ""],
  ]},
  { n: 5, name: "Reset and Local", items: [
    ["Reset activities", "design", ""], ["Neighborhood board", "design", ""], ["Local business profiles", "todo", ""],
  ]},
  { n: 6, name: "Business side", items: [
    ["Employer portal", "todo", ""], ["Recruiter portal", "todo", ""], ["Paid plans and billing", "todo", ""], ["Admin and moderation", "partial", "Staff access built; tools to come"],
  ]},
];

export const CHECKS: [string, CheckStatus, string][] = [
  ["Core logic compiles", "pass", "Matching, pay rules, sample data"],
  ["Match engine tests", "pass", ""],
  ["Pay labels are honest", "pass", "Database rules block bad records"],
  ["Pay privacy", "pass", "Pay-fit check locked until employer portal"],
  ["Fair matching", "pass", "No protected traits"],
  ["Staff access", "pass", "Members can't grant themselves staff or admin"],
  ["Full app build", "unverified", "Runs in CI after the first push"],
  ["Accessibility", "unverified", ""],
];

export const SERVICES: [string, ServiceStatus, string][] = [
  ["Landing page", "live", ""],
  ["Supabase", "off", ""],
  ["Anthropic API", "off", ""],
  ["Netlify", "off", "Chosen; repo ready"],
  ["Job listings provider", "blocked", "Choose an authorized source"],
  ["Mapbox", "off", "Phase 2"],
  ["Stripe", "off", "Phase 6"],
];

export const STEPS: [string, string][] = [
  ["Push the repo to GitHub (private)", "You or Claude Code"],
  ["Create Supabase project and run both migrations", "You"],
  ["Make yourself founder in staff_members", "You"],
  ["Add Anthropic API key", "You"],
  ["Deploy to Netlify", "You or Claude Code"],
  ["Pick a job data source", "You"],
  ["Legal review", "Lawyer"],
];

const WEIGHT: Record<FeatureStatus, number> = { done: 1, partial: 0.5, design: 0.2, todo: 0 };
export function percent(items: [string, FeatureStatus, string][]): number {
  return Math.round((items.reduce((a, i) => a + WEIGHT[i[1]], 0) / items.length) * 100);
}
