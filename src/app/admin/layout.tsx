import type { Metadata } from "next";
import { getViewer } from "@/lib/admin/staff";
import { PathdWordmark } from "@/components/brand/Logo";

export const metadata: Metadata = {
  title: "PATHD Team",
  robots: { index: false, follow: false, nocache: true },
};

// Staff pages are never cached or pre-rendered: the access check runs on every request.
export const dynamic = "force-dynamic";

/**
 * Layouts aren't a security boundary in Next.js, so every staff page checks
 * access itself (see mission-control/page.tsx). The layout only adds the team
 * header for staff; non-staff see the page's reroute screen on its own.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const viewer = await getViewer();
  if (!viewer.staff) return <>{children}</>;
  return (
    <>
      <header className="border-b border-line bg-cream" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
          <PathdWordmark />
          <span className="rounded-full bg-plum px-3 py-1 text-xs font-semibold text-cream">PATHD Team</span>
          <span className="ml-auto text-sm text-plum-soft">{viewer.staff.role === "founder" ? "Founder" : "Team"} access</span>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-6xl px-5 py-10">{children}</main>
    </>
  );
}
