"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { PathdWordmark } from "@/components/brand/Logo";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/explore/parts";
import { cn } from "@/lib/env";

interface MenuLink { href: string; label: string; note: string }
interface Menu { id: string; label: string; links: MenuLink[] }

const MENUS: Menu[] = [
  {
    id: "explore",
    label: "Explore",
    links: [
      { href: "/explore", label: "Map", note: "Jobs by pay and distance from home" },
      { href: "/explore/jobs", label: "Job list", note: "All fields, sorted your way" },
      { href: "/explore/hot", label: "What's hot", note: "Events, good news and congrats nearby" },
      { href: "/explore/saved", label: "Saved jobs", note: "Everything you hearted" },
      { href: "/explore/reset", label: "Reset", note: "Walks, trails, wellness and events" },
      { href: "/explore/charts", label: "PATHD Charts", note: "Best places to work, ranked by employees" },
      { href: "/explore/popups", label: "Hiring pop-ups", note: "Walk-in interviews today" },
      { href: "/explore/add", label: "Work spots", note: "Coffee shops and coworking that welcome laptops" },
    ],
  },
  {
    id: "community",
    label: "Community",
    links: [
      { href: "/community", label: "Circles and study groups", note: "Find your people" },
      { href: "/community#neighborhood", label: "Neighborhood board", note: "Local events and good news" },
      { href: "/community#business", label: "Restaurants and local businesses", note: "Open spots and offers" },
      { href: "/explore/perks", label: "Milestone Perks", note: "Deals for interview day, new jobs and more" },
      { href: "/explore/linkup", label: "Link Up", note: "Meet halfway for coffee or study" },
      { href: "/explore/pros", label: "Pros and mentors", note: "Tips and mock interviews" },
    ],
  },
  {
    id: "fields",
    label: "Fields",
    links: [
      { href: "/#fields", label: "All 12 fields", note: "Nursing, tech, finance, business and more" },
      { href: "/explore/jobs?field=health", label: "Healthcare and nursing", note: "RN, NP, therapy" },
      { href: "/explore/jobs?field=stem", label: "STEM and tech", note: "Software, data, security" },
      { href: "/explore/jobs?field=fin", label: "Finance", note: "Analysts, risk, banking" },
      { href: "/explore/jobs?field=biz", label: "Business", note: "Operations and sales" },
    ],
  },
];

/** A disclosure dropdown: opens on click or keyboard, closes on outside click or Escape. */
function Dropdown({ menu, open, onToggle, onClose }: { menu: Menu; open: boolean; onToggle: () => void; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) onClose(); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-expanded={open} aria-controls={`menu-${menu.id}`} onClick={onToggle} className={cn("flex items-center gap-1 rounded-full px-3 py-2 text-[15px] font-medium text-plum hover:bg-plum/5", open && "bg-plum/5")}>
        {menu.label}
        <Icon name="chevron" className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div id={`menu-${menu.id}`} className="absolute left-0 top-full z-50 mt-2 w-80 rounded-2xl border border-line bg-paper p-2 shadow-[var(--shadow-lift)]">
          {menu.links.map((l) => (
            <Link key={l.href} href={l.href} onClick={onClose} className="block rounded-xl px-3 py-2.5 hover:bg-cream">
              <span className="block text-[15px] font-semibold text-plum-deep">{l.label}</span>
              <span className="block text-[13px] text-plum-soft">{l.note}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState<boolean>(false);
  const path = usePathname();
  useEffect(() => { setOpen(null); setMobile(false); }, [path]);

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-cream/95 backdrop-blur" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 px-3 sm:gap-4 sm:px-5">
        <Link href="/" aria-label="PATHD home"><PathdWordmark /></Link>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {MENUS.map((m) => (
            <Dropdown key={m.id} menu={m} open={open === m.id} onToggle={() => setOpen(open === m.id ? null : m.id)} onClose={() => setOpen(null)} />
          ))}
          <Link href="/pricing" className="rounded-full px-3 py-2 text-[15px] font-medium text-plum hover:bg-plum/5">Pricing</Link>
        </nav>
        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <span className="hidden sm:inline-flex"><LinkButton href="/sign-in" variant="ghost" size="sm">Sign in</LinkButton></span>
          <LinkButton href="/sign-up" variant="action" size="sm" className="min-h-11 px-3 sm:px-4" aria-label="Start your path"><span className="hidden min-[360px]:inline">Start your path</span><span className="min-[360px]:hidden">Start</span></LinkButton>
          <button type="button" aria-expanded={mobile} aria-controls="mobile-menu" aria-label={mobile ? "Close menu" : "Open menu"} onClick={() => setMobile(!mobile)} className="grid h-10 w-10 place-items-center rounded-full border border-line bg-paper text-plum shrink-0 lg:hidden">
            <Icon name={mobile ? "close" : "menu"} />
          </button>
        </div>
      </div>
      {mobile && (
        <nav id="mobile-menu" aria-label="Menu" className="max-h-[calc(100dvh-64px)] overflow-y-auto border-t border-line bg-cream px-5 pb-6 lg:hidden">
          {MENUS.map((m) => (
            <details key={m.id} className="group border-b border-line py-1" open={m.id === "explore"}>
              <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-semibold text-plum-deep">
                {m.label}
                <Icon name="chevron" className="h-4 w-4 transition-transform group-open:rotate-180" />
              </summary>
              <ul className="grid gap-1 pb-3">
                {m.links.map((l) => (
                  <li key={l.href}><Link href={l.href} className="block rounded-xl px-3 py-2 text-[15px] text-plum hover:bg-paper">{l.label}</Link></li>
                ))}
              </ul>
            </details>
          ))}
          <Link href="/pricing" className="block border-b border-line py-4 text-base font-semibold text-plum-deep">Pricing</Link>
          <Link href="/sign-in" className="block py-4 text-base font-semibold text-plum-deep">Sign in</Link>
        </nav>
      )}
    </header>
  );
}
