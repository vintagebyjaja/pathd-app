"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { STATES, cityLabel, nearbyCities, type City } from "@/lib/explore/cities";
import { usePathname } from "next/navigation";
import { useExplore } from "./ExploreProvider";
import { Icon, type IconName } from "./parts";
import { cn } from "@/lib/env";

export const EXPLORE_TABS: { href: string; label: string; icon: IconName }[] = [
  { href: "/explore", label: "Map", icon: "map" },
  { href: "/explore/jobs", label: "Jobs", icon: "jobs" },
  { href: "/explore/hot", label: "What's hot", icon: "hot" },
  { href: "/explore/saved", label: "Saved", icon: "heart" },
  { href: "/explore/reset", label: "Reset", icon: "reset" },
  { href: "/profile", label: "Profile", icon: "profile" },
];

function isActive(path: string, href: string) {
  return href === "/explore" ? path === "/explore" : path === href || path.startsWith(`${href}/`);
}

/** Phone: app-style bar fixed to the bottom, like a dating or social app. */
export function ExploreBottomBar() {
  const path = usePathname() ?? "/";
  const { saved } = useExplore();
  return (
    <nav aria-label="Explore" className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}>
      <ul className="grid grid-cols-6">
        {EXPLORE_TABS.map((t) => {
          const active = isActive(path, t.href);
          return (
            <li key={t.href}>
              <Link href={t.href} aria-current={active ? "page" : undefined} className={cn("relative flex h-16 flex-col items-center justify-center gap-1 text-[10.5px] leading-none", active ? "font-bold text-plum" : "text-plum-soft")}>
                <span className={cn("grid h-8 w-8 place-items-center rounded-full", active && (t.icon === "heart" ? "bg-peach text-plum-deep" : "bg-lavender-wash"))}>
                  <Icon name={t.icon} className="h-[21px] w-[21px]" filled={active && t.icon === "heart"} />
                </span>
                {t.label === "What's hot" ? "Hot" : t.label}
                {t.icon === "heart" && saved.length > 0 && (
                  <span className="absolute right-[18%] top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-peach-deep px-1 text-[10px] font-bold text-plum-deep">{saved.length}</span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Computer: the same screens as a tab strip under the header. */
export function ExploreTopTabs() {
  const path = usePathname() ?? "/";
  const { saved } = useExplore();
  return (
    <nav aria-label="Explore" className="hidden border-b border-line bg-cream lg:block">
      <ul className="mx-auto flex max-w-6xl gap-1 px-5 py-2">
        {EXPLORE_TABS.map((t) => {
          const active = isActive(path, t.href);
          return (
            <li key={t.href}>
              <Link href={t.href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold", active ? "bg-plum text-cream" : "text-plum hover:bg-plum/5")}>
                <Icon name={t.icon} className="h-[18px] w-[18px]" filled={active && t.icon === "heart"} />
                {t.label}
                {t.icon === "heart" && saved.length > 0 && <span className={cn("rounded-full px-1.5 text-xs", active ? "bg-cream text-plum" : "bg-peach text-plum-deep")}>{saved.length}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** City switcher: pick a state, then a city. Nearby cities are one tap away. */
export function CityPicker() {
  const { city, setCity } = useExplore();
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<string>(city.state);
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  useEffect(() => { setState(city.state); }, [city]);
  // The chip row scrolls sideways, which would clip a normal dropdown, so the panel is fixed-positioned under the button.
  const toggle = () => {
    const b = ref.current?.getBoundingClientRect();
    if (b) setPos({ top: b.bottom + 8, left: Math.max(12, Math.min(b.left, window.innerWidth - 396)) });
    setOpen(!open);
  };
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);
  const pick = (c: City) => { setCity(c); setOpen(false); };
  const cities = STATES.find((s) => s.code === state)?.cities ?? [];
  return (
    <div ref={ref} className="relative shrink-0">
      <button type="button" aria-expanded={open} aria-controls="city-picker" onClick={toggle} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-plum px-3.5 text-[13px] font-semibold text-cream">
        <Icon name="pin" className="h-4 w-4" />{cityLabel(city)}<Icon name="chevron" className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div id="city-picker" style={pos ? { top: pos.top, left: typeof window !== "undefined" && window.innerWidth < 640 ? 12 : pos.left } : undefined} className="fixed right-3 z-50 max-h-[70dvh] overflow-y-auto rounded-2xl border border-line bg-paper p-4 shadow-[var(--shadow-lift)] sm:right-auto sm:w-96">
          <label className="grid gap-1 text-sm font-semibold text-plum">State
            <select value={state} onChange={(e) => setState(e.target.value)} className="h-11 rounded-xl border border-line bg-cream px-3 text-[15px] font-normal text-plum-deep">
              {STATES.map((s) => <option key={s.code} value={s.code}>{s.name}</option>)}
            </select>
          </label>
          <p className="mt-4 text-sm font-semibold text-plum">Cities</p>
          <ul className="mt-2 grid grid-cols-2 gap-2">
            {cities.map((c) => (
              <li key={c.id}><button type="button" aria-pressed={c.id === city.id} onClick={() => pick(c)} className={cn("w-full rounded-xl border px-3 py-2 text-left text-sm font-semibold", c.id === city.id ? "border-plum bg-plum text-cream" : "border-line bg-cream text-plum")}>{c.name}</button></li>
            ))}
          </ul>
          <p className="mt-4 text-sm font-semibold text-plum">Near {city.name}</p>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {nearbyCities(city, 5).map(({ city: c, miles }) => (
              <li key={c.id}><button type="button" onClick={() => pick(c)} className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-semibold text-plum">{cityLabel(c)} <span className="font-normal text-plum-soft">{Math.round(miles)} mi</span></button></li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-plum-soft">PATHD is live in every state. Pick where you live now or where you&apos;re moving next.</p>
        </div>
      )}
    </div>
  );
}

const MORE: { href: string; label: string }[] = [
  { href: "/explore/charts", label: "Charts" },
  { href: "/explore/perks", label: "Milestone Perks" },
  { href: "/explore/linkup", label: "Link Up" },
  { href: "/explore/pros", label: "Pros and mentors" },
  { href: "/explore/popups", label: "Hiring pop-ups" },
  { href: "/community", label: "Circles" },
  { href: "/explore/add", label: "Work spots" },
];

/** Secondary screens, one tap away on every explore page (scrolls sideways on phones). */
export function ExploreMoreNav() {
  const path = usePathname() ?? "/";
  return (
    <nav aria-label="More to explore" className="border-b border-line bg-paper/60">
      <ul className="mx-auto flex max-w-6xl items-center gap-2 overflow-x-auto px-5 py-2.5">
        <li className="shrink-0"><CityPicker /></li>
        {MORE.map((m) => {
          const active = path === m.href;
          return (
            <li key={m.href} className="shrink-0">
              <Link href={m.href} aria-current={active ? "page" : undefined} className={cn("inline-flex h-9 items-center rounded-full border px-3.5 text-[13px] font-semibold", active ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum hover:border-plum")}>{m.label}</Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
