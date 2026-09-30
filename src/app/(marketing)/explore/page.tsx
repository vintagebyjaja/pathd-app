import type { Metadata } from "next";
import { MapExplorer } from "@/components/explore/MapExplorer";
import { isFieldId } from "@/lib/explore/fields";

export const metadata: Metadata = { title: "Map" };

export default async function ExploreMapPage({ searchParams }: { searchParams: Promise<{ field?: string }> }) {
  const { field } = await searchParams;
  const initial = isFieldId(field) ? field : null;
  return (
    <>
      <div className="mb-4">
        <h1 className="font-display text-3xl text-plum md:text-4xl">See how far every job really is</h1>
        <p className="mt-1 text-plum-soft">Tap a pin for pay, the workplace and your commute. Add your child&apos;s school or another place that matters.</p>
      </div>
      <MapExplorer key={initial ?? "all"} initialField={initial} />
    </>
  );
}
