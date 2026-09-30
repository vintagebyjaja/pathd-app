import type { ReactNode } from "react";
import { ExploreMoreNav, ExploreTopTabs } from "@/components/explore/ExploreTabs";

export default function ExploreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <ExploreTopTabs />
      <ExploreMoreNav />
      <main id="main" className="mx-auto max-w-6xl px-5 py-6 lg:py-8">{children}</main>
    </>
  );
}
