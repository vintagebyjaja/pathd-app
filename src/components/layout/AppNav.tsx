"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PathdWordmark } from "@/components/brand/Logo";
import { cn } from "@/lib/env";

export interface NavItem {
  href: string;
  label: string;
  icon: "home" | "map" | "swipe" | "routes" | "circles" | "network" | "applications" | "jobs" | "profile";
}

export const DESKTOP_NAV: NavItem[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/jobs", label: "Jobs", icon: "jobs" },
  { href: "/map", label: "Map", icon: "map" },
  { href: "/swipe", label: "Swipe", icon: "swipe" },
  { href: "/routes", label: "Routes", icon: "routes" },
  { href: "/circles", label: "Circles", icon: "circles" },
  { href: "/network", label: "Network", icon: "network" },
  { href: "/applications", label: "Applications", icon: "applications" },
];

export const MOBILE_NAV: NavItem[] = [
  { href: "/home", label: "Home", icon: "home" },
  { href: "/map", label: "Map", icon: "map" },
  { href: "/swipe", label: "Swipe", icon: "swipe" },
  { href: "/circles", label: "Circles", icon: "circles" },
  { href: "/profile", label: "Profile", icon: "profile" },
];

const PATHS: Record<NavItem["icon"], string> = {
  home: "M4 11l8-6 8 6v8a1 1 0 01-1 1h-4v-5H9v5H5a1 1 0 01-1-1z",
  map: "M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2zM9 4v14M15 6v14",
  swipe: "M7 5h8a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2zM19 8v10",
  routes: "M6 19a2 2 0 100-4 2 2 0 000 4zM18 9a2 2 0 100-4 2 2 0 000 4zM6 15V11a4 4 0 014-4h6",
  circles: "M9 12a3 3 0 100-6 3 3 0 000 6zM16 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 1.5-4 4-4s3 1.5 3 4",
  network: "M12 8a2 2 0 100-4 2 2 0 000 4zM5 20a2 2 0 100-4 2 2 0 000 4zM19 20a2 2 0 100-4 2 2 0 000 4zM12 8v4M12 12l-6 4M12 12l6 4",
  applications: "M7 4h10v16H7zM10 8h4M10 12h4M10 16h2",
  jobs: "M4 8h16v11H4zM9 8V5h6v3",
  profile: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6",
};

export function NavIcon({ icon, className = "h-5 w-5" }: { icon: NavItem["icon"]; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[icon]} />
    </svg>
  );
}

function isActive(path: string, href: string) {
  return path === href || path.startsWith(`${href}/`);
}

export function AppNav() {
  const path = usePathname();
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-cream/95 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5">
          <Link href="/home" aria-label="PATHD home"><PathdWordmark /></Link>
          <nav aria-label="App" className="hidden flex-1 lg:block">
            <ul className="flex gap-1">
              {DESKTOP_NAV.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    aria-current={isActive(path, n.href) ? "page" : undefined}
                    className={cn("rounded-full px-3 py-2 text-sm text-plum hover:bg-plum/5", isActive(path, n.href) && "bg-plum text-cream hover:bg-plum")}
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-1">
            <Link href="/radar" className="rounded-full px-3 py-2 text-sm font-semibold text-plum hover:bg-plum/5">Radar</Link>
            <Link href="/profile" aria-label="Your profile" className="grid h-9 w-9 place-items-center rounded-full bg-lavender text-plum-deep">
              <NavIcon icon="profile" className="h-4.5 w-4.5" />
            </Link>
          </div>
        </div>
      </header>

      <nav
        aria-label="App"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-paper/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        <ul className="grid grid-cols-5">
          {MOBILE_NAV.map((n) => {
            const active = isActive(path, n.href);
            return (
              <li key={n.href}>
                <Link href={n.href} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-0.5 py-2.5 text-[11px]", active ? "font-semibold text-plum" : "text-plum-soft")}>
                  <NavIcon icon={n.icon} />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
