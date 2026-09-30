"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { FieldId, Job } from "@/types/domain";
import { FIELDS, FIELD_BY_ID } from "@/lib/explore/fields";
import {
  CIRCLES, EMPLOYER_RATINGS, EVENTS, HOODS, LOCAL, MEET_SPOTS, PERKS, POPUPS, POSTS, PROS,
  type CircleSample, type EmployerRating, type MeetSpot, type Perk, type PerkMoment, type PopUp, type Pro,
} from "@/lib/explore/samples";
import { EXPLORE_JOBS, annualPay, fmtMiles, payText } from "@/lib/explore/jobs";
import { milesBetween } from "@/lib/geo/distance";
import { monogram, sceneSvg } from "@/lib/explore/scenes";
import { cn } from "@/lib/env";
import { CityEmpty, useSampleCity } from "./parts";
import { cityLabel } from "@/lib/explore/cities";

const chip = (on: boolean) => cn("h-10 whitespace-nowrap rounded-full border px-4 text-sm font-semibold", on ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum");
const Sample = () => <p className="text-xs text-plum-soft">Sample content for illustration.</p>;

/* ───────────────────────── PATHD Charts ───────────────────────── */

type ChartTab = "employers" | "pay" | "growth" | "flexibility" | "toppay" | "circles";
const CHART_TABS: { id: ChartTab; label: string }[] = [
  { id: "employers", label: "Top employers" },
  { id: "pay", label: "Pay fairness" },
  { id: "growth", label: "Growth" },
  { id: "flexibility", label: "Flexibility" },
  { id: "toppay", label: "Top pay by field" },
  { id: "circles", label: "Biggest circles" },
];
const MIN_RATINGS = 5;
const PRIOR_WEIGHT = 10;

type Metric = "overall" | keyof EmployerRating["scores"];
const metricOf = (r: EmployerRating, m: Metric) => {
  const s = r.scores;
  return m === "overall" ? (s.pay + s.management + s.growth + s.flexibility + s.culture) / 5 : s[m];
};

/** Confidence ranking: pulls small samples toward the average so one perfect rating never beats a crowd of great ones. */
function rankEmployers(metric: Metric) {
  const eligible = EMPLOYER_RATINGS.filter((r: EmployerRating) => r.ratings >= MIN_RATINGS);
  const total = eligible.reduce((a: number, r: EmployerRating) => a + r.ratings, 0);
  const mean = eligible.reduce((a: number, r: EmployerRating) => a + metricOf(r, metric) * r.ratings, 0) / Math.max(total, 1);
  return eligible
    .map((r: EmployerRating) => ({ r, raw: metricOf(r, metric), score: (PRIOR_WEIGHT * mean + r.ratings * metricOf(r, metric)) / (PRIOR_WEIGHT + r.ratings) }))
    .sort((a, b) => b.score - a.score);
}

export function ChartsScreen() {
  const { city, sample: live } = useSampleCity();
  const [tab, setTab] = useState<ChartTab>("employers");
  const notYet = EMPLOYER_RATINGS.filter((r: EmployerRating) => r.ratings < MIN_RATINGS);

  const topPay = useMemo(() => FIELDS.map((f) => {
    const best = EXPLORE_JOBS.filter((j: Job) => j.field === f.id && j.salary.source === "employer_listed" && !!j.location.point && milesBetween(city, j.location.point) <= 45).sort((a: Job, b: Job) => annualPay(b) - annualPay(a))[0];
    return { field: f.name, job: best };
  }).filter((x): x is { field: string; job: Job } => !!x.job).sort((a, b) => annualPay(b.job) - annualPay(a.job)), [city]);

  const metric: Metric = tab === "pay" ? "pay" : tab === "growth" ? "growth" : tab === "flexibility" ? "flexibility" : "overall";
  const ranked = rankEmployers(metric);

  return (
    <div className="grid gap-5">
      <p className="text-sm text-plum-soft">Showing <span className="font-semibold text-plum">{cityLabel(city)}</span>. Change the city with the pin button above.</p>
      <div className="-mx-5 overflow-x-auto px-5"><div className="flex w-max gap-2" role="group" aria-label="Chart">
        {CHART_TABS.map((t) => <button key={t.id} type="button" aria-pressed={tab === t.id} onClick={() => setTab(t.id)} className={chip(tab === t.id)}>{t.label}</button>)}
      </div></div>

      {!live ? (
        <CityEmpty what="chart rankings" />
      ) : tab === "toppay" ? (
        <ol className="grid gap-2">
          {topPay.map((x, i) => (
            <li key={x.field} className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
              <span className="w-8 font-display text-2xl text-plum">{i + 1}</span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-plum-deep">{x.field}</p>
                <p className="truncate text-sm text-plum-soft">{x.job.title}, {x.job.company.name}</p>
              </div>
              <span className="font-display text-lg text-plum">{payText(x.job)}</span>
            </li>
          ))}
        </ol>
      ) : tab === "circles" ? (
        <ol className="grid gap-2">
          {[...CIRCLES].sort((a: CircleSample, b: CircleSample) => b.members - a.members).map((c: CircleSample, i: number) => (
            <li key={c.id} className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
              <span className="w-8 font-display text-2xl text-plum">{i + 1}</span>
              <div className="min-w-0 flex-1"><p className="font-semibold text-plum-deep">{c.title}</p><p className="text-sm text-plum-soft">{FIELD_BY_ID[c.field].name}. {c.when}.</p></div>
              <span className="rounded-full bg-lavender px-3 py-1 text-sm font-bold text-plum-deep">{c.members}</span>
            </li>
          ))}
        </ol>
      ) : (
        <ol className="grid gap-2">
          {ranked.map(({ r, raw, score }, i) => {
            const logo = monogram(r.company);
            return (
              <li key={r.company} className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
                <span className="w-8 font-display text-2xl text-plum">{i + 1}</span>
                <span aria-hidden="true" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold" style={{ background: logo.bg, color: logo.fg }}>{logo.initials}</span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-plum-deep">{r.company}</p>
                  <p className="text-sm text-plum-soft">{FIELD_BY_ID[r.field].name}. {r.ratings} verified ratings. Average {raw.toFixed(1)}.</p>
                </div>
                <span className="text-right"><span className="block font-display text-2xl text-plum">{score.toFixed(2)}</span><span className="text-[11px] text-plum-soft">PATHD score</span></span>
              </li>
            );
          })}
        </ol>
      )}

      <ul className="grid gap-1.5 text-sm text-plum-soft">
        <li>Ranked on confidence, not raw averages: one perfect rating never beats a crowd of great ones.</li>
        <li>Employers need {MIN_RATINGS}+ verified ratings to chart.{notYet.length > 0 && ` Not enough yet: ${notYet.map((r: EmployerRating) => `${r.company} (${r.ratings})`).join(", ")}.`}</li>
        <li>Payment never changes a PATHD score or chart rank. Paid placements are always labeled Sponsored.</li>
        <li>Top pay uses employer-listed pay only.</li>
      </ul>
      <Sample />
    </div>
  );
}

/* ───────────────────────── Milestone Perks ───────────────────────── */

const MOMENTS: PerkMoment[] = ["Interview day", "New job", "Graduation", "License passed", "Birthday"];

export function PerksScreen() {
  const { sample } = useSampleCity();
  const [m, setM] = useState<PerkMoment | null>(null);
  const perks = m ? PERKS.filter((p: Perk) => p.moment === m) : PERKS;
  if (!sample) return <CityEmpty what="milestone perks" />;
  return (
    <div className="grid gap-5">
      <p className="rounded-2xl bg-lavender-wash p-4 text-sm text-plum"><Link href="/sign-up" className="font-semibold underline underline-offset-4">Create an account</Link> to get a heads-up when a milestone unlocks a perk near you.</p>
      <div className="-mx-5 overflow-x-auto px-5"><div className="flex w-max gap-2" role="group" aria-label="Milestone">
        <button type="button" aria-pressed={!m} onClick={() => setM(null)} className={chip(!m)}>All</button>
        {MOMENTS.map((x) => <button key={x} type="button" aria-pressed={m === x} onClick={() => setM(x)} className={chip(m === x)}>{x}</button>)}
      </div></div>
      <h2 className="font-display text-2xl text-plum">{m ?? "All milestone perks"} ({perks.length})</h2>
      <ul className="grid gap-3 md:grid-cols-2">
        {perks.map((p: Perk) => (
          <li key={p.id} className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full bg-peach-wash px-2.5 py-0.5 text-xs font-bold text-plum">{p.moment}</span>
              <span className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-plum-soft">{p.window}</span>
            </div>
            <h3 className="mt-2 text-lg font-bold text-plum-deep">{p.title}</h3>
            <p className="text-sm font-semibold text-plum">{p.business}, {p.where}</p>
            <p className="mt-1 text-sm text-plum-soft">{p.detail}</p>
            <p className="mt-2 text-sm text-plum-deep"><span className="font-semibold">Needs:</span> {p.needs}</p>
            <p className="mt-1 text-xs text-plum-soft">{p.source}. Confirmed {p.confirmed}.</p>
          </li>
        ))}
      </ul>
      <p className="text-sm text-plum-soft">Perks are set by each business and can change. Confirm with them before you go. PATHD never shares your offer letter or pay; badges only show the milestone.</p>
      <Sample />
    </div>
  );
}

/* ───────────────────────── Link Up ───────────────────────── */

interface Person { name: string; hood: number }
const PURPOSES = ["Coffee chat", "Study session", "Mock interview", "Networking meetup"];

/** Suggests the spot with the fairest commute: the smallest longest trip, then the smallest average. */
export function LinkUpScreen() {
  const { sample } = useSampleCity();
  const [purpose, setPurpose] = useState<string>(PURPOSES[0]!);
  const [people, setPeople] = useState<Person[]>([{ name: "You", hood: 1 }, { name: "Maya", hood: 8 }, { name: "Chris", hood: 7 }]);

  const ranked = useMemo(() => MEET_SPOTS.map((s: MeetSpot) => {
    const d = people.map((p: Person) => milesBetween(HOODS[p.hood]?.point ?? HOODS[0]!.point, s.point));
    return { s, d, max: Math.max(...d), avg: d.reduce((a: number, b: number) => a + b, 0) / d.length };
  }).sort((a, b) => a.max - b.max || a.avg - b.avg), [people]);

  const update = (i: number, patch: Partial<Person>) => setPeople(people.map((p: Person, j: number) => (j === i ? { ...p, ...patch } : p)));
  if (!sample) return <CityEmpty what="Link Up spots" />;

  return (
    <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <section aria-labelledby="h-who" className="h-fit rounded-[var(--radius-card)] border border-line bg-paper p-5">
        <h2 id="h-who" className="font-display text-2xl text-plum">Who&apos;s coming?</h2>
        <label className="mt-4 grid gap-1 text-sm font-semibold text-plum">
          What for
          <select value={purpose} onChange={(e: ChangeEvent<HTMLSelectElement>) => setPurpose(e.target.value)} className="h-11 rounded-xl border border-line bg-cream px-3 text-[15px] font-normal text-plum-deep">
            {PURPOSES.map((p) => <option key={p}>{p}</option>)}
          </select>
        </label>
        <ul className="mt-4 grid gap-3">
          {people.map((p: Person, i: number) => (
            <li key={i} className="grid grid-cols-[1fr_1.3fr_auto] items-end gap-2">
              <label className="grid gap-1 text-xs font-semibold text-plum">Name
                <input value={p.name} maxLength={30} onChange={(e: ChangeEvent<HTMLInputElement>) => update(i, { name: e.target.value })} className="h-10 rounded-xl border border-line bg-cream px-2.5 text-sm font-normal text-plum-deep" />
              </label>
              <label className="grid gap-1 text-xs font-semibold text-plum">Coming from
                <select value={p.hood} onChange={(e: ChangeEvent<HTMLSelectElement>) => update(i, { hood: Number(e.target.value) })} className="h-10 rounded-xl border border-line bg-cream px-2 text-sm font-normal text-plum-deep">
                  {HOODS.map((h, k) => <option key={h.name} value={k}>{h.name}</option>)}
                </select>
              </label>
              <button type="button" aria-label={`Remove ${p.name || "person"}`} disabled={people.length <= 2} onClick={() => setPeople(people.filter((_: Person, j: number) => j !== i))} className="h-10 w-10 rounded-full border border-line text-plum disabled:opacity-40">×</button>
            </li>
          ))}
        </ul>
        {people.length < 6 && <button type="button" onClick={() => setPeople([...people, { name: `Friend ${people.length}`, hood: 0 }])} className="mt-3 h-10 rounded-full border border-line bg-cream px-4 text-sm font-semibold text-plum">Add someone</button>}
        <p className="mt-3 text-xs text-plum-soft">Uses neighborhoods, never home addresses. Up to 6 people.</p>
      </section>

      <section aria-labelledby="h-spots" aria-live="polite">
        <h2 id="h-spots" className="font-display text-2xl text-plum">Fairest spots for your {purpose.toLowerCase()}</h2>
        <p className="text-sm text-plum-soft">Ranked so nobody gets stuck with the long drive.</p>
        <ol className="mt-4 grid gap-3">
          {ranked.slice(0, 3).map(({ s, d, max }, i: number) => (
            <li key={s.id} className={cn("rounded-[var(--radius-card)] border p-5", i === 0 ? "border-plum bg-lavender-wash" : "border-line bg-paper")}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {i === 0 && <span className="rounded-full bg-plum px-2.5 py-0.5 text-xs font-bold text-cream">Fairest pick</span>}
                  <h3 className="mt-1 text-lg font-bold text-plum-deep">{s.name}</h3>
                  <p className="text-sm text-plum-soft">{s.kind}. {s.tags.join(", ")}.</p>
                </div>
                <p className="text-right text-sm text-plum"><span className="block font-display text-2xl">{fmtMiles(max)}</span>longest trip</p>
              </div>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {people.map((p: Person, k: number) => <li key={k} className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs font-semibold text-plum">{p.name || "Someone"}: {fmtMiles(d[k] ?? 0)}</li>)}
              </ul>
            </li>
          ))}
        </ol>
        <Link href="/sign-up" className="mt-4 inline-flex h-11 items-center rounded-full bg-peach px-5 font-semibold text-plum-deep">Send the Link Up</Link>
        <p className="mt-3 text-xs text-plum-soft">Straight-line distances. Sample spots.</p>
      </section>
    </div>
  );
}

/* ───────────────────────── Pros and mentors ───────────────────────── */

export function ProsScreen() {
  const [field, setField] = useState<FieldId | "">("");
  const pros = field ? PROS.filter((p: Pro) => p.field === field) : PROS;
  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="flex items-center gap-2 text-sm font-semibold text-plum">Field
          <select value={field} onChange={(e: ChangeEvent<HTMLSelectElement>) => setField(e.target.value as FieldId | "")} className="h-10 rounded-full border border-line bg-paper px-3 text-sm text-plum-deep">
            <option value="">All fields</option>
            {FIELDS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
          </select>
        </label>
        <Link href="/sign-up" className="inline-flex h-10 items-center rounded-full bg-plum px-4 text-sm font-semibold text-cream">Become a PATHD Pro</Link>
      </div>
      <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {pros.map((p: Pro) => {
          const logo = monogram(p.name);
          return (
            <li key={p.id} className="flex flex-col gap-3 rounded-[var(--radius-card)] border border-line bg-paper p-5">
              <div className="flex items-center gap-3">
                <span aria-hidden="true" className="grid h-12 w-12 place-items-center rounded-full font-extrabold" style={{ background: logo.bg, color: logo.fg }}>{logo.initials}</span>
                <div>
                  <p className="font-bold text-plum-deep">{p.name} {p.verified && <span className="ml-1 rounded-full bg-gold-wash px-2 py-0.5 text-[11px] font-bold text-gold-ink">✓ Verified</span>}</p>
                  <p className="text-sm text-plum-soft">{p.role}, {p.years} years. {FIELD_BY_ID[p.field].name}.</p>
                </div>
              </div>
              <blockquote className="rounded-xl bg-cream p-3 text-sm leading-relaxed text-plum-deep">“{p.tip}”</blockquote>
              <p className="text-xs font-semibold text-plum">Offers: {p.offers.join(", ")}</p>
              <Link href="/sign-up" className="mt-auto inline-flex h-10 items-center justify-center rounded-full border border-line bg-cream text-sm font-semibold text-plum">Request a chat</Link>
            </li>
          );
        })}
      </ul>
      <p className="text-sm text-plum-soft">Pros are verified through their license or employer before getting the badge. Tips are opinions, not guarantees.</p>
      <Sample />
    </div>
  );
}

/* ───────────────────────── Hiring pop-ups ───────────────────────── */

export function PopupsScreen() {
  const { sample } = useSampleCity();
  const today = POPUPS.filter((p: PopUp) => p.today);
  const later = POPUPS.filter((p: PopUp) => !p.today);
  if (!sample) return <CityEmpty what="hiring pop-ups" />;
  const Card = ({ p }: { p: PopUp }) => (
    <li className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper">
      <div className="h-24" dangerouslySetInnerHTML={{ __html: sceneSvg(p.field === "health" ? "hospital" : p.field === "cons" ? "site" : p.field === "hosp" ? "hotel" : "loft", "#F2A889") }} />
      <div className="p-4">
        <p className="text-xs font-bold text-peach-deep">{p.when}</p>
        <h3 className="mt-1 font-bold text-plum-deep">{p.title}</h3>
        <p className="text-sm font-semibold text-plum">{p.employer}. {p.where}.</p>
        <p className="mt-1 text-sm text-plum-soft">{p.detail}</p>
      </div>
    </li>
  );
  return (
    <div className="grid gap-8">
      <section aria-labelledby="h-today"><h2 id="h-today" className="font-display text-2xl text-plum">Today</h2><ul className="mt-3 grid gap-3 md:grid-cols-2">{today.map((p: PopUp) => <Card key={p.id} p={p} />)}</ul></section>
      <section aria-labelledby="h-week"><h2 id="h-week" className="font-display text-2xl text-plum">This week</h2><ul className="mt-3 grid gap-3 md:grid-cols-3">{later.map((p: PopUp) => <Card key={p.id} p={p} />)}</ul></section>
      <p className="text-sm text-plum-soft">Pop-ups are posted by the employer. Details can change, so check their listing before you go. <Link href="/pricing" className="font-semibold text-plum underline underline-offset-4">Employers: post a pop-up</Link></p>
      <Sample />
    </div>
  );
}

/* ───────────────────────── Work spots and Add a place ───────────────────────── */

const SPOT_KINDS: MeetSpot["kind"][] = ["Coffee shop", "Coworking", "Library", "Restaurant"];
const AMENITIES = ["Fast Wi-Fi", "Outlets", "Quiet area", "Group tables", "Meeting rooms", "Phone booths", "Parking", "Printing"];

export function AddPlaceScreen() {
  const { city, sample } = useSampleCity();
  const [kind, setKind] = useState<MeetSpot["kind"] | null>(null);
  const [mode, setMode] = useState<"spot" | "workplace">("spot");
  const [sent, setSent] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const spots = MEET_SPOTS.filter((s: MeetSpot) => !kind || s.kind === kind).sort((a: MeetSpot, b: MeetSpot) => Number(b.featured) - Number(a.featured));
  const submit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); if (name.trim()) setSent(name.trim()); };
  const input = "mt-1 h-11 w-full rounded-xl border border-line bg-cream px-3 text-[15px] font-normal text-plum-deep";

  return (
    <div className="grid gap-10">
      <section aria-labelledby="h-spots-feat">
        <h2 id="h-spots-feat" className="font-display text-2xl text-plum">Work-friendly spots in {city.name}</h2>
        <p className="text-sm text-plum-soft">Coffee shops, coworking spaces and libraries that welcome laptops, remote work and study groups.</p>
        {!sample ? <div className="mt-4"><CityEmpty what="work spots" /></div> : (
          <>
            <div className="-mx-5 mt-4 overflow-x-auto px-5"><div className="flex w-max gap-2" role="group" aria-label="Type of spot">
              <button type="button" aria-pressed={!kind} onClick={() => setKind(null)} className={chip(!kind)}>All</button>
              {SPOT_KINDS.map((k) => <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)} className={chip(kind === k)}>{k}</button>)}
            </div></div>
            <ul className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {spots.map((sp: MeetSpot) => (
                <li key={sp.id} className={cn("overflow-hidden rounded-[var(--radius-card)] border bg-paper", sp.featured ? "border-plum" : "border-line")}>
                  <div className="relative h-28" >
                    <div className="absolute inset-0" dangerouslySetInnerHTML={{ __html: sceneSvg(sp.kind === "Coworking" ? "cowork" : sp.kind === "Library" ? "community" : sp.kind === "Restaurant" ? "restaurant" : "cafe", "#747A4C") }} />
                    {sp.featured && <span className="absolute left-3 top-3 rounded-full bg-plum px-2.5 py-0.5 text-[11px] font-bold text-cream">★ Featured</span>}
                  </div>
                  <div className="p-4">
                    <p className="text-xs font-bold text-olive-ink">{sp.kind}, {sp.neighborhood}</p>
                    <h3 className="mt-1 font-bold text-plum-deep">{sp.name}</h3>
                    <p className="mt-1 text-sm font-semibold text-plum">{sp.laptop}</p>
                    <p className="text-sm text-plum-soft">{sp.hours}{sp.dayPass ? `. ${sp.dayPass}` : ""}</p>
                    <ul className="mt-2 flex flex-wrap gap-1.5">{sp.tags.map((t) => <li key={t} className="rounded-full bg-cream px-2.5 py-0.5 text-xs font-semibold text-plum">{t}</li>)}</ul>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-plum-soft">Featured means PATHD checked the laptop policy and amenities. It&apos;s never paid; paid placements are labeled Sponsored. Sample spots.</p>
          </>
        )}
      </section>

      <section aria-labelledby="h-add">
        <h2 id="h-add" className="font-display text-2xl text-plum">Add a place</h2>
        {sent ? (
          <div className="mt-4 max-w-xl rounded-[var(--radius-card)] border border-line bg-paper p-6">
            <p className="font-display text-2xl text-plum">Thanks for adding {sent}</p>
            <p className="mt-2 text-plum-soft">Every submission is reviewed before it appears. Demo mode: this wasn&apos;t saved, since accounts aren&apos;t connected yet.</p>
            <button type="button" onClick={() => { setSent(null); setName(""); }} className="mt-4 h-11 rounded-full bg-peach px-5 font-semibold text-plum-deep">Add another</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-4 grid max-w-xl gap-4 rounded-[var(--radius-card)] border border-line bg-paper p-6">
            <div className="flex gap-2" role="group" aria-label="What are you adding">
              <button type="button" aria-pressed={mode === "spot"} onClick={() => setMode("spot")} className={chip(mode === "spot")}>A work spot</button>
              <button type="button" aria-pressed={mode === "workplace"} onClick={() => setMode("workplace")} className={chip(mode === "workplace")}>A workplace</button>
            </div>
            <p className="text-sm text-plum-soft">{mode === "spot" ? "A coffee shop, coworking space or library where people can work or study." : "A company or employer others can find and rate."}</p>
            <label className="text-sm font-semibold text-plum">Name<input required value={name} maxLength={120} onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)} className={input} /></label>
            {mode === "spot" ? (
              <>
                <label className="text-sm font-semibold text-plum">Type<select className={input} defaultValue="Coffee shop">{SPOT_KINDS.map((k) => <option key={k}>{k}</option>)}</select></label>
                <label className="text-sm font-semibold text-plum">Laptop policy<select className={input} defaultValue="">{[<option key="" value="">Choose one</option>, ...["Laptops welcome all day", "Weekdays only", "Limited hours", "Members or day passes only"].map((o) => <option key={o}>{o}</option>)]}</select></label>
                <fieldset className="text-sm text-plum"><legend className="font-semibold">Amenities</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">{AMENITIES.map((a) => <label key={a} className="flex items-center gap-2"><input type="checkbox" className="h-4 w-4 accent-plum" />{a}</label>)}</div>
                </fieldset>
              </>
            ) : (
              <label className="text-sm font-semibold text-plum">Field<select className={input} defaultValue="">{[<option key="" value="">Choose a field</option>, ...FIELDS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)]}</select></label>
            )}
            <label className="text-sm font-semibold text-plum">City<input defaultValue={cityLabel(city)} className={input} /></label>
            <label className="text-sm font-semibold text-plum">Neighborhood or street <span className="font-normal text-plum-soft">(optional)</span><input className={input} /></label>
            <label className="text-sm font-semibold text-plum">Website <span className="font-normal text-plum-soft">(optional)</span><input type="url" placeholder="https://" className={input} /></label>
            <fieldset className="text-sm text-plum">
              <legend className="font-semibold">You are</legend>
              {(mode === "spot" ? ["A regular", "The owner or a manager", "A first-time visitor"] : ["A current employee", "A former employee", "The owner or a manager"]).map((rel) => (
                <label key={rel} className="mt-2 flex items-center gap-2"><input type="radio" name="relationship" value={rel} className="h-4 w-4 accent-plum" />{rel}</label>
              ))}
            </fieldset>
            <button type="submit" className="h-11 justify-self-start rounded-full bg-peach px-5 font-semibold text-plum-deep">Submit for review</button>
            <p className="text-xs text-plum-soft">We check every place before it goes live. Owners can claim their page later.</p>
          </form>
        )}
      </section>
    </div>
  );
}

/* ───────────────────────── Reset ───────────────────────── */

export function ResetScreen() {
  const { sample } = useSampleCity();
  const events = EVENTS.filter((e) => e.reset);
  const places = LOCAL.filter((p) => p.wellness);
  const posts = POSTS.filter((p) => p.kind === "Reset event" || p.kind === "Volunteer" || p.kind === "Community win");
  if (!sample) return <CityEmpty what="Reset events" />;
  return (
    <div className="grid gap-9">
      <div className="rounded-[var(--radius-card)] bg-olive p-6 text-cream">
        <p className="max-w-xl text-cream/85">Step away from the job search. Walks, runs, trails and places to recharge with people nearby.</p>
      </div>
      <section aria-labelledby="h-rev">
        <h2 id="h-rev" className="font-display text-2xl text-plum">This week</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {events.map((e) => (
            <li key={e.id} className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper">
              <div className="h-28" dangerouslySetInnerHTML={{ __html: sceneSvg(e.scene, "#747A4C") }} />
              <div className="p-4">
                <p className="text-xs font-bold text-olive-ink">{e.when}</p>
                <h3 className="mt-1 font-semibold text-plum-deep">{e.title}</h3>
                <p className="text-sm text-plum-soft">{e.desc}. {e.going} going.</p>
                <Link href="/sign-up" className="mt-3 inline-flex h-10 items-center rounded-full bg-olive px-4 text-sm font-semibold text-cream">I&apos;m going</Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="h-rpl">
        <h2 id="h-rpl" className="font-display text-2xl text-plum">Places to recharge</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {places.map((p) => (
            <li key={p.id} className="flex items-center gap-3 rounded-2xl border border-line bg-olive-wash p-4">
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-xl" dangerouslySetInnerHTML={{ __html: sceneSvg(p.scene, "#747A4C") }} />
              <div><h3 className="font-semibold text-plum-deep">{p.title}</h3><p className="text-sm text-plum-soft">{p.desc}</p></div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="h-rgn">
        <h2 id="h-rgn" className="font-display text-2xl text-plum">Good news nearby</h2>
        <ul className="mt-3 grid gap-3 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.id} className="rounded-2xl border border-line bg-paper p-4">
              <span className="text-xs font-bold text-olive-ink">{p.kind}</span>
              <h3 className="mt-1 font-semibold text-plum-deep">{p.title}</h3>
              <p className="text-sm text-plum-soft">{p.when}</p>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-xs text-plum-soft">Samples for illustration. Reset is for community and wellness activities, not medical or mental health care.</p>
    </div>
  );
}
