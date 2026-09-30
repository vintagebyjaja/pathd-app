import type { ReactNode } from "react";
import { ExploreProvider } from "@/components/explore/ExploreProvider";
import { ExploreBottomBar } from "@/components/explore/ExploreTabs";
import { SiteHeader } from "@/components/marketing/SiteHeader";

/** Public site shell: header with dropdowns, and an app-style tab bar on phones. */
export default function MarketingLayout({ children }: { children: ReactNode }) {
  return (
    <ExploreProvider>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-plum focus:px-4 focus:py-2 focus:text-cream">Skip to content</a>
      <SiteHeader />
      <div className="pb-20 lg:pb-0">{children}</div>
      <ExploreBottomBar />
    </ExploreProvider>
  );
}
