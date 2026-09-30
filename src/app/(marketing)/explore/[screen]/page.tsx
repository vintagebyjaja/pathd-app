import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HotExplorer, JobListExplorer, SavedExplorer } from "@/components/explore/screens";
import { AddPlaceScreen, ChartsScreen, LinkUpScreen, PerksScreen, PopupsScreen, ProsScreen, ResetScreen } from "@/components/explore/more";
import { isFieldId } from "@/lib/explore/fields";

/** Every explore screen except the map shares this route: /explore/jobs, /explore/charts, and so on. */
const SCREENS: Record<string, { title: string; heading: string; sub?: string }> = {
  jobs: { title: "Jobs", heading: "Jobs" },
  hot: { title: "What's hot", heading: "What\u2019s hot in your community", sub: "Events, good news, congrats, new neighbors and game day in your community." },
  saved: { title: "Saved jobs", heading: "Saved jobs" },
  reset: { title: "Reset", heading: "Reset" },
  charts: { title: "PATHD Charts", heading: "PATHD Charts", sub: "The best places to work in your city, ranked by the people who work there." },
  perks: { title: "Milestone Perks", heading: "Milestone Perks", sub: "Local deals for your interview day, new job, graduation, license and birthday." },
  linkup: { title: "Link Up", heading: "Link Up", sub: "Plan a coffee chat, study session or mock interview at a spot that's fair for everyone's commute." },
  pros: { title: "Pros and mentors", heading: "Pros and mentors", sub: "Verified professionals sharing tips, resume reviews and mock interviews." },
  popups: { title: "Hiring pop-ups", heading: "Hiring pop-ups", sub: "Walk-in interviews and hiring events near you, today and this week." },
  add: { title: "Work spots", heading: "Work spots", sub: "Coffee shops, coworking and libraries that welcome laptops, plus a place to add your own." },
};

export async function generateMetadata({ params }: { params: Promise<{ screen: string }> }): Promise<Metadata> {
  return { title: SCREENS[(await params).screen]?.title ?? "Explore" };
}

export default async function ExploreScreenPage({ params, searchParams }: { params: Promise<{ screen: string }>; searchParams: Promise<{ field?: string }> }) {
  const { screen } = await params;
  const meta = SCREENS[screen];
  if (!meta) notFound();
  const { field } = await searchParams;
  const initial = isFieldId(field) ? field : null;

  return (
    <>
      <h1 className="font-display text-3xl text-plum md:text-4xl">{meta.heading}</h1>
      {meta.sub ? <p className="mb-6 mt-1 text-plum-soft">{meta.sub}</p> : <div className="mb-4" />}
      {screen === "jobs" && <JobListExplorer key={initial ?? "all"} initialField={initial} />}
      {screen === "hot" && <HotExplorer />}
      {screen === "saved" && <SavedExplorer />}
      {screen === "reset" && <ResetScreen />}
      {screen === "charts" && <ChartsScreen />}
      {screen === "perks" && <PerksScreen />}
      {screen === "linkup" && <LinkUpScreen />}
      {screen === "pros" && <ProsScreen />}
      {screen === "popups" && <PopupsScreen />}
      {screen === "add" && <AddPlaceScreen />}
    </>
  );
}
