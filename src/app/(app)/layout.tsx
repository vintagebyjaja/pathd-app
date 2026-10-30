import SecurityGate from "@/components/companion/SecurityGate";
import { AppNav } from "@/components/layout/AppNav";
import { DemoBanner } from "@/components/ui/Button";
import { isDemoMode } from "@/lib/env";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-plum focus:px-4 focus:py-2 focus:text-cream">
        Skip to content
      </a>
      {isDemoMode && <DemoBanner />}
      <AppNav />
      <main id="main" className="mx-auto max-w-6xl px-5 pb-28 pt-8 lg:pb-16"><SecurityGate>{children}</SecurityGate></main>
    </>
  );
}
