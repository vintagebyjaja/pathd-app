import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmptyState, LinkButton } from "@/components/ui/Button";

/** Member screens that arrive in later phases share one placeholder route. */
const SOON: Record<string, { name: string; phase: number; body: string }> = {
  swipe: { name: "Swipe", phase: 2, body: "Pass, save or apply to salary-first job cards, with buttons for every gesture." },
  applications: { name: "Applications", phase: 2, body: "Track every application from interested to offer in one place." },
  routes: { name: "Routes", phase: 3, body: "Career paths broken into waypoints, with what each step takes and how close you are." },
  radar: { name: "Radar", phase: 3, body: "Tell Radar the role, pay and distance you want, and get notified when a match is posted." },
  circles: { name: "Circles", phase: 4, body: "Goal-based groups for licensure, study, majors, industries and wellness." },
  network: { name: "Network", phase: 4, body: "Connections, shared companies and schools, and help asking for an introduction." },
};

export function generateStaticParams() {
  return Object.keys(SOON).map((section) => ({ section }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ section: string }> }): Promise<Metadata> {
  const s = SOON[(await params).section];
  return { title: s?.name ?? "PATHD" };
}

export default async function ComingSoonPage({ params }: { params: Promise<{ section: string }> }) {
  const s = SOON[(await params).section];
  if (!s) notFound();
  return (
    <div className="grid gap-6">
      <h1 className="font-display text-4xl text-plum">{s.name}</h1>
      <EmptyState title={`${s.name} arrives in phase ${s.phase}`} body={s.body} action={<LinkButton href="/explore/jobs" variant="action">Browse jobs now</LinkButton>} />
    </div>
  );
}
