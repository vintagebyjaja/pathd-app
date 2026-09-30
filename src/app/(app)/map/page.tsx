import type { Metadata } from "next";
import { ExploreProvider } from "@/components/explore/ExploreProvider";
import { MapExplorer } from "@/components/explore/MapExplorer";

export const metadata: Metadata = { title: "Map" };

export default function MemberMapPage() {
  return (
    <ExploreProvider>
      <h1 className="mb-4 font-display text-3xl text-plum md:text-4xl">PATHD Map</h1>
      <MapExplorer />
    </ExploreProvider>
  );
}
