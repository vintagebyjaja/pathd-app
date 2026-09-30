"use client";

import Link from "next/link";
import { CityEmpty, Icon, JobRow, useSampleCity } from "./parts";
import { useEffect, useMemo, useState } from "react";
import { FEED, type FeedKind, type FeedPost } from "@/lib/explore/samples";
import { cn } from "@/lib/env";
import type { FieldId, Job } from "@/types/domain";
import { FIELDS } from "@/lib/explore/fields";
import { EXPLORE_JOBS, annualPay, distanceTo } from "@/lib/explore/jobs";
import { useExplore } from "./ExploreProvider";

const KINDS: FeedKind[] = ["Event", "Good news", "Congrats", "New in town", "Celebration", "Game day"];

const KIND_STYLE: Record<FeedKind, { tag: string; card: string }> = {
  Event: { tag: "bg-gold-wash text-gold-ink", card: "bg-paper" },
  "Good news": { tag: "bg-olive-wash text-olive-ink", card: "bg-paper" },
  Congrats: { tag: "bg-peach-wash text-plum", card: "bg-paper" },
  "New in town": { tag: "bg-lavender-wash text-plum", card: "bg-paper" },
  Celebration: { tag: "bg-plum text-cream", card: "bg-lavender-wash" },
  "Game day": { tag: "bg-peach text-plum-deep", card: "bg-paper" },
};

const ACTION: Partial<Record<FeedKind, string>> = { Congrats: "Say congrats", Celebration: "Send wishes", "New in town": "Say hi" };
const CHEER_KEY = "pathd:cheers:v1";

/**
 * What's hot: the community feed. Events, good news, congrats, new neighbors,
 * celebrations and game day. Cheers and RSVPs are kept on this device until
 * sign-in; posting and replying need an account.
 */
export function HotExplorer() {
  const { sample } = useSampleCity();
  const [kind, setKind] = useState<FeedKind | null>(null);
  const [cheered, setCheered] = useState<string[]>([]);
  const [going, setGoing] = useState<string[]>([]);

  useEffect(() => {
    try {
      const s = JSON.parse(window.localStorage.getItem(CHEER_KEY) ?? "{}") as { cheered?: string[]; going?: string[] };
      if (Array.isArray(s.cheered)) setCheered(s.cheered);
      if (Array.isArray(s.going)) setGoing(s.going);
    } catch {
      /* ignore */
    }
  }, []);
  const save = (c: string[], g: string[]) => {
    try { window.localStorage.setItem(CHEER_KEY, JSON.stringify({ cheered: c, going: g })); } catch { /* ignore */ }
  };
  const toggle = (list: string[], id: string) => (list.includes(id) ? list.filter((x: string) => x !== id) : [...list, id]);

  const posts = kind ? FEED.filter((p: FeedPost) => p.kind === kind) : FEED;
  if (!sample) return <CityEmpty what="community posts" />;
  const upcoming = FEED.filter((p: FeedPost) => p.kind === "Event");

  return (
    <div className="grid gap-6">
      <div className="-mx-5 overflow-x-auto px-5">
        <ul className="flex w-max gap-3 pb-1" aria-label="Happening soon">
          {upcoming.map((e: FeedPost) => (
            <li key={e.id} className="w-64 shrink-0 rounded-[var(--radius-card)] bg-plum p-4 text-cream">
              <p className="text-xs font-bold text-peach">{e.when}</p>
              <p className="mt-1 font-semibold leading-snug">{e.title}</p>
              <p className="mt-1 text-xs text-cream/75">{e.where}. {(e.going ?? 0) + (going.includes(e.id) ? 1 : 0)} going.</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="-mx-5 overflow-x-auto px-5" role="group" aria-label="Filter posts">
          <div className="flex w-max gap-2">
            <button type="button" aria-pressed={!kind} onClick={() => setKind(null)} className={cn("h-10 rounded-full border px-4 text-sm font-semibold", !kind ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>All</button>
            {KINDS.map((k: FeedKind) => (
              <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={cn("h-10 whitespace-nowrap rounded-full border px-4 text-sm font-semibold", kind === k ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>{k}</button>
            ))}
          </div>
        </div>
        <Link href="/sign-up" className="inline-flex h-10 items-center rounded-full bg-peach px-4 text-sm font-semibold text-plum-deep">Share something</Link>
      </div>

      <ul className="grid gap-3 md:grid-cols-2">
        {posts.map((p: FeedPost) => {
          const isCheered = cheered.includes(p.id);
          const isGoing = going.includes(p.id);
          const st = KIND_STYLE[p.kind];
          const action = ACTION[p.kind];
          return (
            <li key={p.id} className={cn("flex flex-col gap-2 rounded-[var(--radius-card)] border border-line p-5", st.card)}>
              <div className="flex items-center justify-between gap-2">
                <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold", st.tag)}>{p.kind}</span>
                <span className="text-xs text-plum-soft">{p.when}</span>
              </div>
              <h2 className="text-lg font-bold leading-snug text-plum-deep">{p.title}</h2>
              <p className="text-[15px] leading-relaxed text-plum-soft">{p.body}</p>
              <p className="text-xs font-semibold text-plum">{p.by}, {p.where}</p>
              <div className="mt-1 flex flex-wrap gap-2">
                <button
                  type="button"
                  aria-pressed={isCheered}
                  onClick={() => { const c = toggle(cheered, p.id); setCheered(c); save(c, going); }}
                  className={cn("inline-flex h-9 items-center gap-1.5 rounded-full border px-3.5 text-sm font-semibold", isCheered ? "border-peach-deep bg-peach text-plum-deep" : "border-line bg-paper text-plum")}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill={isCheered ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M12 20.5s-7.3-4.5-9.6-8.9C.7 8.3 2.7 4.5 6.4 4.5c2.2 0 3.8 1.2 5.6 3.3 1.8-2.1 3.4-3.3 5.6-3.3 3.7 0 5.7 3.8 4 7.1-2.3 4.4-9.6 8.9-9.6 8.9z" /></svg>
                  Cheer <span className="font-normal">{p.cheers + (isCheered ? 1 : 0)}</span>
                </button>
                {p.kind === "Event" && (
                  <button type="button" aria-pressed={isGoing} onClick={() => { const g = toggle(going, p.id); setGoing(g); save(cheered, g); }} className={cn("h-9 rounded-full border px-3.5 text-sm font-semibold", isGoing ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>
                    {isGoing ? "You're going" : "I'm going"} <span className="font-normal">{(p.going ?? 0) + (isGoing ? 1 : 0)}</span>
                  </button>
                )}
                {action && <Link href="/sign-up" className="inline-flex h-9 items-center rounded-full border border-line bg-paper px-3.5 text-sm font-semibold text-plum">{action}</Link>}
              </div>
            </li>
          );
        })}
      </ul>
      <p className="text-xs leading-relaxed text-plum-soft">
        Sample posts. On PATHD, people only appear in posts they share or approve themselves. Posts are moderated, with no follower counts or engagement bait. Game results will come from a licensed sports feed or local posts.
      </p>
    </div>
  );
}

type Sort = "closest" | "pay" | "newest";

export function JobListExplorer({ initialField = null }: { initialField?: FieldId | null }) {
  const { home, radius } = useExplore();
  const { city, sample } = useSampleCity();
  const [field, setField] = useState<FieldId | null>(initialField);
  const [sort, setSort] = useState<Sort>("closest");
  const [remoteOnly, setRemoteOnly] = useState<boolean>(false);
  const [payOnly, setPayOnly] = useState<boolean>(false);

  const list = useMemo<Job[]>(() => {
    const rows = EXPLORE_JOBS.filter((j: Job) => {
      if (field && j.field !== field) return false;
      if (remoteOnly && j.workType !== "remote") return false;
      if (payOnly && j.salary.source === "not_provided") return false;
      const d = distanceTo(home, j);
      return d == null || d <= radius;
    });
    return rows.sort((a: Job, b: Job) => {
      if (sort === "pay") return annualPay(b) - annualPay(a);
      if (sort === "newest") return b.postedAt.localeCompare(a.postedAt);
      return (distanceTo(home, a) ?? -1) - (distanceTo(home, b) ?? -1);
    });
  }, [field, sort, remoteOnly, payOnly, home, radius]);

  return (
    <div className="grid gap-4">
      <div className="-mx-5 overflow-x-auto px-5" role="group" aria-label="Filter by field">
        <div className="flex w-max gap-2 pb-1">
          <button type="button" aria-pressed={!field} onClick={() => setField(null)} className={cn("h-10 rounded-full border px-4 text-sm font-semibold", !field ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>All fields</button>
          {FIELDS.map((f) => (
            <button key={f.id} type="button" aria-pressed={field === f.id} onClick={() => setField(f.id)} className={cn("h-10 whitespace-nowrap rounded-full border px-4 text-sm font-semibold", field === f.id ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>{f.name}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <label className="flex items-center gap-2 text-sm font-semibold text-plum">
          Sort
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="h-10 rounded-full border border-line bg-paper px-3 text-sm text-plum-deep">
            <option value="closest">Closest to home</option>
            <option value="pay">Highest pay</option>
            <option value="newest">Newest</option>
          </select>
        </label>
        <button type="button" aria-pressed={remoteOnly} onClick={() => setRemoteOnly(!remoteOnly)} className={cn("h-10 rounded-full border px-4 text-sm font-semibold", remoteOnly ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>Remote only</button>
        <button type="button" aria-pressed={payOnly} onClick={() => setPayOnly(!payOnly)} className={cn("h-10 rounded-full border px-4 text-sm font-semibold", payOnly ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>Shows pay</button>
      </div>

      {!sample && <CityEmpty what="local job listings" />}
      {!sample && <h2 className="font-display text-2xl text-plum">Remote jobs you can do from {city.name}</h2>}
      <p className="text-sm text-plum-soft" aria-live="polite">
        {list.length} {list.length === 1 ? "job" : "jobs"} within {radius} miles of home, plus remote. Sample listings.
      </p>
      {list.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-line bg-paper p-6 text-center text-plum-soft">No jobs match. Try another field or widen the distance on the map screen.</p>
      ) : (
        <ul className="grid gap-2.5 md:grid-cols-2">
          {list.map((j: Job) => <JobRow key={j.id} job={j} />)}
        </ul>
      )}
    </div>
  );
}

export function SavedExplorer() {
  const { saved } = useExplore();
  const jobs = saved.map((id: string) => EXPLORE_JOBS.find((j: Job) => j.id === id)).filter((j): j is Job => !!j);

  if (jobs.length === 0) {
    return (
      <div className="grid justify-items-center gap-3 rounded-[var(--radius-card)] border border-dashed border-line bg-paper px-6 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full bg-peach-wash text-peach-deep"><Icon name="heart" className="h-7 w-7" filled /></span>
        <h2 className="font-display text-2xl text-plum">No saved jobs yet</h2>
        <p className="max-w-sm text-plum-soft">Tap the heart on any job to keep it here. Saved jobs stay on this device until you create an account.</p>
        <Link href="/explore/jobs" className="mt-2 inline-flex h-11 items-center rounded-full bg-peach px-5 font-semibold text-plum-deep">Browse jobs</Link>
      </div>
    );
  }
  return (
    <div className="grid gap-3">
      <p className="text-sm text-plum-soft">{jobs.length} saved on this device. <Link href="/sign-up" className="font-semibold text-plum underline underline-offset-4">Create an account</Link> to keep them everywhere.</p>
      <ul className="grid gap-2.5 md:grid-cols-2">{jobs.map((j: Job) => <JobRow key={j.id} job={j} />)}</ul>
    </div>
  );
}
