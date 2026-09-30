"use client";

import { useExplore } from "./ExploreProvider";
import { CHARLOTTE, cityLabel, hasSampleData, nearbyCities } from "@/lib/explore/cities";
import { cn } from "@/lib/env";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Job } from "@/types/domain";
import { distanceTo, fmtMiles, payText, postedLabel, workLabel } from "@/lib/explore/jobs";
import { milesBetween } from "@/lib/geo/distance";
import { monogram } from "@/lib/explore/scenes";

const PATHS = {
  map: "M9 4l-5 2v14l5-2 6 2 5-2V4l-5 2-6-2zM9 4v14M15 6v14",
  jobs: "M4 8h16v11H4zM9 8V5h6v3M4 13h16",
  hot: "M12 21c4 0 7-2.7 7-6.6 0-3.4-2.3-5.3-3.6-7.4-.4 1.8-1.3 3-2.4 3.6C13.4 7.3 11.6 4.6 9 3c.3 3.1-1.3 5-2.6 6.6C5.3 11 5 12.3 5 14.4 5 18.3 8 21 12 21z",
  heart: "M12 20.5s-7.3-4.5-9.6-8.9C.7 8.3 2.7 4.5 6.4 4.5c2.2 0 3.8 1.2 5.6 3.3 1.8-2.1 3.4-3.3 5.6-3.3 3.7 0 5.7 3.8 4 7.1-2.3 4.4-9.6 8.9-9.6 8.9z",
  reset: "M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7",
  profile: "M12 12a4 4 0 100-8 4 4 0 000 8zM4 21c0-4 4-6 8-6s8 2 8 6",
  circles: "M9 12a3 3 0 100-6 3 3 0 000 6zM16 13a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM3 20c0-3 3-5 6-5s6 2 6 5M14 20c0-2 1.5-4 4-4s3 1.5 3 4",
  chevron: "M6 9l6 6 6-6",
  menu: "M4 7h16M4 12h16M4 17h16",
  close: "M6 6l12 12M18 6L6 18",
  pin: "M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0113 0C18.5 14.8 12 21 12 21zM12 12.3a2.5 2.5 0 100-5 2.5 2.5 0 000 5z",
} as const;

export type IconName = keyof typeof PATHS;

export function Icon({ name, className = "h-5 w-5", filled = false }: { name: IconName; className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export function HeartButton({ jobId, title, className }: { jobId: string; title: string; className?: string }) {
  const { isSaved, toggleSaved } = useExplore();
  const on = isSaved(jobId);
  return (
    <button
      type="button"
      onClick={() => toggleSaved(jobId)}
      aria-pressed={on}
      aria-label={on ? `Remove ${title} from saved jobs` : `Save ${title}`}
      className={cn(
        "grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-colors",
        on ? "border-peach-deep bg-peach text-plum-deep" : "border-line bg-paper text-plum hover:border-plum",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinejoin="round">
        <path d="M12 20.5s-7.3-4.5-9.6-8.9C.7 8.3 2.7 4.5 6.4 4.5c2.2 0 3.8 1.2 5.6 3.3 1.8-2.1 3.4-3.3 5.6-3.3 3.7 0 5.7 3.8 4 7.1-2.3 4.4-9.6 8.9-9.6 8.9z" />
      </svg>
    </button>
  );
}

/** Salary-first job row for the Jobs, Hot and Saved screens. */
export function JobRow({ job, showPosted = false }: { job: Job; showPosted?: boolean }) {
  const { home, place } = useExplore();
  // Relative times differ between server and browser; show them after mount.
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);
  const d = distanceTo(home, job);
  const dp = place && job.location.point ? milesBetween(place, job.location.point) : null;
  const logo = monogram(job.company.name);
  const src = job.salary.source;
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-paper p-3.5">
      <span aria-hidden="true" className="grid h-11 w-11 shrink-0 place-items-center rounded-xl text-sm font-extrabold" style={{ background: logo.bg, color: logo.fg }}>{logo.initials}</span>
      <Link href={`/jobs/${job.id}`} className="min-w-0 flex-1">
        <span className={cn("block font-display text-lg leading-tight", src === "employer_listed" ? "text-plum" : "text-plum-soft")}>
          {payText(job)}
          {src === "pathd_estimate" && <span className="ml-1.5 align-middle font-sans text-[11px] font-semibold">PATHD estimate</span>}
        </span>
        <span className="block truncate text-[15px] font-semibold text-plum-deep">{job.title}</span>
        <span className="block truncate text-[13px] text-plum-soft">
          {job.company.name}. {workLabel(job)}
          {d != null ? `. ${fmtMiles(d)} from home` : ". No commute"}
          {dp != null && place ? `, ${fmtMiles(dp)} from ${place.type.toLowerCase()}` : ""}
          {showPosted && mounted ? `. Posted ${postedLabel(job.postedAt)}` : ""}
        </span>
      </Link>
      <HeartButton jobId={job.id} title={job.title} />
    </li>
  );
}


/** Shown when a city has no listings or posts yet. PATHD is live there; data fills in as people post. */
export function CityEmpty({ what }: { what: string }) {
  const { city, setCity } = useExplore();
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-paper p-6 text-center">
      <p className="font-display text-2xl text-plum">No {what} in {cityLabel(city)} yet</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-plum-soft">PATHD is live here. {what[0]!.toUpperCase() + what.slice(1)} show up as members, employers and businesses post. Sample content is in Charlotte for now.</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {nearbyCities(city, 4).map(({ city: c, miles }) => (
          <button key={c.id} type="button" onClick={() => setCity(c)} className="rounded-full border border-line bg-cream px-3.5 py-1.5 text-sm font-semibold text-plum">{cityLabel(c)} <span className="font-normal text-plum-soft">{Math.round(miles)} mi</span></button>
        ))}
        {city.id !== CHARLOTTE.id && <button type="button" onClick={() => setCity(CHARLOTTE)} className="rounded-full bg-plum px-3.5 py-1.5 text-sm font-semibold text-cream">See Charlotte</button>}
      </div>
    </div>
  );
}

/** True when the chosen city has sample content to show. */
export function useSampleCity() {
  const { city } = useExplore();
  return { city, sample: hasSampleData(city) };
}
