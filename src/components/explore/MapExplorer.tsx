"use client";

import Link from "next/link";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent as RKeyboardEvent, PointerEvent as RPointerEvent } from "react";
import type { FieldId, GeoPoint, Job } from "@/types/domain";
import { FIELDS, FIELD_BY_ID } from "@/lib/explore/fields";
import { CIRCLES, EVENTS, HOODS, LOCAL, type CircleSample, type EventSample, type PlaceSample, type SceneType } from "@/lib/explore/samples";
import { fmtMiles, jobsInField, payText, pinPay, workLabel } from "@/lib/explore/jobs";
import { milesBetween } from "@/lib/geo/distance";
import { CHARLOTTE, cityLabel, hasSampleData, nearestCity, nearbyCities, type City } from "@/lib/explore/cities";
import { monogram, sceneSvg } from "@/lib/explore/scenes";
import { useExplore } from "./ExploreProvider";
import { HeartButton } from "./parts";
import { cn } from "@/lib/env";

/* ───────── Projection (centered on the chosen city, equirectangular) ───────── */
// Set by <MapExplorer> for the chosen city before the map renders.
let LAT0 = 35.5;
let LNG0 = -81.25;
let CENTER: GeoPoint = { lat: 35.2, lng: -80.835 };
function setOrigin(c: GeoPoint) {
  CENTER = c.lat === CHARLOTTE.lat && c.lng === CHARLOTTE.lng ? { lat: 35.2, lng: -80.835 } : { lat: c.lat, lng: c.lng };
  LAT0 = CENTER.lat + 0.3;
  LNG0 = CENTER.lng - 0.415;
}
const KX = 1000 * Math.cos((35.2 * Math.PI) / 180);
const KY = 1000;
const W = 0.75 * KX;
const H = 0.55 * KY;
const toWorld = (p: GeoPoint): [number, number] => [(p.lng - LNG0) * KX, (LAT0 - p.lat) * KY];
const toGeo = (x: number, y: number): GeoPoint => ({ lat: LAT0 - y / KY, lng: LNG0 + x / KX });

type LL = [number, number];
const pathD = (pts: LL[]) => pts.map((p, i) => { const [x, y] = toWorld({ lat: p[0], lng: p[1] }); return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`; }).join(" ");
const ellipse = (lat: number, lng: number, rl: number, rg: number, n: number): LL[] =>
  Array.from({ length: n + 1 }, (_, i) => { const t = (i / n) * 2 * Math.PI; return [lat + rl * Math.sin(t), lng + rg * Math.cos(t)] as LL; });

const ROADS: LL[][] = [
  [[34.95, -80.94], [35.0, -80.93], [35.1, -80.88], [35.19, -80.865], [35.225, -80.853], [35.26, -80.84], [35.33, -80.84], [35.41, -80.855], [35.5, -80.87]],
  [[35.26, -81.25], [35.25, -81.1], [35.24, -80.96], [35.255, -80.87], [35.27, -80.82], [35.3, -80.75], [35.35, -80.68], [35.41, -80.6], [35.47, -80.52]],
  [[35.215, -80.83], [35.18, -80.75], [35.13, -80.68], [35.08, -80.55]],
  [[35.215, -80.855], [35.22, -80.95], [35.24, -81.05]],
  [[35.18, -80.84], [35.1, -80.85], [35.0, -80.84], [34.95, -80.83]],
  ellipse(35.21, -80.845, 0.145, 0.175, 72),
];
const WATER: LL[][] = [
  [[35.5, -80.95], [35.47, -80.93], [35.44, -80.935], [35.42, -80.92], [35.43, -80.9], [35.46, -80.89], [35.5, -80.88]],
  [[35.18, -81.05], [35.14, -81.06], [35.08, -81.07], [35.03, -81.05], [35.0, -81.03], [35.03, -81.02], [35.09, -81.035], [35.14, -81.035]],
];
const LABELS: [string, number, number][] = [
  ["Uptown", 35.238, -80.843], ["University City", 35.322, -80.735], ["Ballantyne", 35.035, -80.849], ["Matthews", 35.1, -80.723],
  ["Concord", 35.425, -80.58], ["Huntersville", 35.425, -80.843], ["Gastonia", 35.278, -81.187], ["Fort Mill", 34.99, -80.945],
  ["SouthPark", 35.14, -80.829], ["Lake Norman", 35.49, -80.91], ["Lake Wylie", 35.06, -81.085],
];

/* ───────── Map items ───────── */
type Item =
  | { kind: "job"; id: string; point: GeoPoint; job: Job }
  | { kind: "circle"; id: string; point: GeoPoint; circle: CircleSample }
  | { kind: "local"; id: string; point: GeoPoint; place: PlaceSample }
  | { kind: "event"; id: string; point: GeoPoint; event: EventSample };

type Layers = { job: boolean; circle: boolean; local: boolean; event: boolean };
interface View { cx: number; cy: number; vw: number }
interface Rect { x: number; y: number; w: number; h: number }
interface Group { x: number; y: number; rect: Rect; items: Extract<Item, { kind: "job" }>[] }

const PLACE_TYPES = ["Child's school", "Daycare", "Gym", "Work", "Other"];
const LAYER_META: { key: keyof Layers; label: string; color: string }[] = [
  { key: "job", label: "Jobs", color: "#F2A889" },
  { key: "circle", label: "Circles", color: "#C9B8E4" },
  { key: "local", label: "Local", color: "#747A4C" },
  { key: "event", label: "Events", color: "#C6A15B" },
];

const overlaps = (a: Rect, b: Rect) => a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;

/** Re-centers the map on the chosen city; remounts when the city changes. */
export function MapExplorer({ initialField = null }: { initialField?: FieldId | null }) {
  const { city } = useExplore();
  setOrigin(city);
  return <MapInner key={city.id} city={city} initialField={initialField} />;
}

function MapInner({ city, initialField }: { city: City; initialField: FieldId | null }) {
  const { home, place, radius, setHome, setPlace, setRadius, setCity } = useExplore();
  const isCharlotte = city.id === CHARLOTTE.id;
  const sample = hasSampleData(city);
  const [field, setField] = useState<FieldId | null>(initialField);
  const [layers, setLayers] = useState<Layers>({ job: true, circle: true, local: true, event: true });
  const [sel, setSel] = useState<string | null>(null);
  const [placing, setPlacing] = useState<"home" | "place" | null>(null);
  const [placeType, setPlaceType] = useState<string>(PLACE_TYPES[0]!);
  const [status, setStatus] = useState<string>("Your location stays on this device. PATHD never shows it to anyone.");
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [view, setView] = useState<View | null>(null);
  const [panel, setPanel] = useState<"places" | "filters" | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number; cx: number; cy: number; moved: boolean } | null>(null);

  useEffect(() => { if (place) setPlaceType(place.type); }, [place]);

  // Track map size.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

  const fitView = useCallback((w: number, h: number): View => {
    const vw = Math.max(W, (H * w) / h) * 1.02;
    const [cx, cy] = toWorld(CENTER);
    return { cx, cy, vw: vw * (w < 640 ? 0.42 : 0.5) };
  }, []);

  useEffect(() => {
    if (!view && size.w > 0 && size.h > 0) setView(fitView(size.w, size.h));
  }, [size, view, fitView]);

  const vb = useMemo(() => {
    if (!view || !size.w) return null;
    const vh = (view.vw * size.h) / size.w;
    return { x: view.cx - view.vw / 2, y: view.cy - vh / 2, w: view.vw, h: vh };
  }, [view, size]);

  const toScreen = useCallback(
    (p: GeoPoint): [number, number] => {
      if (!vb) return [-999, -999];
      const [x, y] = toWorld(p);
      return [((x - vb.x) / vb.w) * size.w, ((y - vb.y) / vb.h) * size.h];
    },
    [vb, size],
  );

  const items = useMemo<Item[]>(() => {
    const out: Item[] = [];
    if (layers.local) LOCAL.forEach((p: PlaceSample) => out.push({ kind: "local", id: p.id, point: p.point, place: p }));
    if (layers.event) EVENTS.forEach((e: EventSample) => out.push({ kind: "event", id: e.id, point: e.point, event: e }));
    if (layers.circle) CIRCLES.filter((c: CircleSample) => !field || c.field === field).forEach((c: CircleSample) => out.push({ kind: "circle", id: c.id, point: c.point, circle: c }));
    if (layers.job)
      jobsInField(field).forEach((j: Job) => {
        const pt = j.location.point;
        if (pt && milesBetween(home, pt) <= radius) out.push({ kind: "job", id: j.id, point: pt, job: j });
      });
    return out;
  }, [layers, field, home, radius]);

  // Group overlapping job pins into clusters at the current zoom.
  const groups = useMemo<Group[]>(() => {
    const gs: Group[] = [];
    for (const it of items) {
      if (it.kind !== "job") continue;
      const [sx, sy] = toScreen(it.point);
      const w = pinPay(it.job).length * 7 + 20;
      const r: Rect = { x: sx - w / 2, y: sy - 30, w, h: 24 };
      const hit = gs.find((g: Group) => overlaps(g.rect, r));
      if (hit) {
        hit.items.push(it);
        const n = hit.items.length;
        hit.x = (hit.x * (n - 1) + sx) / n;
        hit.y = (hit.y * (n - 1) + sy) / n;
      } else gs.push({ x: sx, y: sy, rect: r, items: [it] });
    }
    return gs;
  }, [items, toScreen]);

  const selected = useMemo<Item | null>(() => {
    if (!sel) return null;
    const j = jobsInField(null).find((x: Job) => x.id === sel);
    if (j && j.location.point) return { kind: "job", id: j.id, point: j.location.point, job: j };
    const c = CIRCLES.find((x: CircleSample) => x.id === sel);
    if (c) return { kind: "circle", id: c.id, point: c.point, circle: c };
    const l = LOCAL.find((x: PlaceSample) => x.id === sel);
    if (l) return { kind: "local", id: l.id, point: l.point, place: l };
    const e = EVENTS.find((x: EventSample) => x.id === sel);
    if (e) return { kind: "event", id: e.id, point: e.point, event: e };
    return null;
  }, [sel]);

  useEffect(() => { if (selected) popupRef.current?.focus({ preventScroll: true }); }, [selected]);

  // Wheel zoom (non-passive so the page doesn't scroll while zooming the map).
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      setView((v: View | null) => (v ? { ...v, vw: clampVw(v.vw * (e.deltaY < 0 ? 0.85 : 1 / 0.85)) } : v));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const zoom = (f: number) => setView((v: View | null) => (v ? { ...v, vw: clampVw(v.vw * f) } : v));
  const centerOn = (p: GeoPoint, f = 1) => {
    const [x, y] = toWorld(p);
    setView((v: View | null) => (v ? { cx: x, cy: y, vw: clampVw(v.vw * f) } : v));
  };

  const onPointerDown = (e: RPointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("[data-map-ui]") || !view) return;
    drag.current = { x: e.clientX, y: e.clientY, cx: view.cx, cy: view.cy, moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || !vb) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) d.moved = true;
    if (!d.moved) return;
    setView((v: View | null) => (v ? { ...v, cx: d.cx - (dx * vb.w) / size.w, cy: d.cy - (dy * vb.h) / size.h } : v));
  };
  const onPointerUp = (e: RPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d || d.moved || !vb) return;
    if (placing) {
      const r = e.currentTarget.getBoundingClientRect();
      const g = toGeo(vb.x + ((e.clientX - r.left) / size.w) * vb.w, vb.y + ((e.clientY - r.top) / size.h) * vb.h);
      if (placing === "home") {
        setHome({ ...g, label: "your pin" });
        setStatus("Starting from the spot you tapped.");
      } else setPlace({ ...g, type: placeType });
      setPlacing(null);
      return;
    }
    if (sel) setSel(null);
  };

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      setStatus("Location isn't available in this browser. Pick a neighborhood or tap the map.");
      return;
    }
    setStatus("Finding your location…");
    navigator.geolocation.getCurrentPosition(
      (pos: GeolocationPosition) => {
        // Round to ~1 km: precise location is never needed.
        const lat = Math.round(pos.coords.latitude * 100) / 100;
        const lng = Math.round(pos.coords.longitude * 100) / 100;
        const near = nearestCity({ lat, lng });
        if (milesBetween({ lat, lng }, city) > 60) {
          setCity(near);
          setStatus(`You're near ${cityLabel(near)}, so we switched the map there.`);
        } else setStatus("Using your approximate location. It stays on this device.");
        setHome({ lat, lng, label: "your location" });
        centerOn({ lat, lng });
      },
      () => setStatus("Location access was blocked. Pick a neighborhood or tap the map."),
      { maximumAge: 600000, timeout: 10000 },
    );
  };

  const [hx, hy] = toScreen(home);
  const ringPx = vb ? ((radius / 69) * KY * size.h) / vb.h : 0;
  const isSheet = size.w > 0 && size.w < 640;
  const fontSize = vb ? (12 * vb.w) / size.w : 12;

  const fieldSelect = (
    <label className="grid gap-1.5 text-sm font-semibold text-plum">
      Field
      <select value={field ?? ""} onChange={(e) => { setField((e.target.value || null) as FieldId | null); setSel(null); }} className="h-11 rounded-xl border border-line bg-paper px-3 text-[15px] font-normal text-plum-deep">
        <option value="">All fields</option>
        {FIELDS.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
    </label>
  );
  const radiusSlider = (
    <label className="grid gap-1.5 text-sm font-semibold text-plum">
      Within {radius} miles of home
      <input type="range" min={3} max={40} value={radius} onChange={(e) => setRadius(Number(e.target.value))} className="accent-plum" />
    </label>
  );
  const placesControls = (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <p className="text-sm font-semibold text-plum">Where do you start?</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={useMyLocation} className="h-10 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-plum">Use my location</button>
          <button type="button" aria-pressed={placing === "home"} onClick={() => setPlacing(placing === "home" ? null : "home")} className={cn("h-10 rounded-full border px-4 text-sm font-semibold", placing === "home" ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>Tap map</button>
        </div>
        {isCharlotte && <select aria-label="Or pick a neighborhood" value="" onChange={(e) => { const h = HOODS[Number(e.target.value)]; if (h) { setHome({ ...h.point, label: h.name }); setStatus(`Starting from ${h.name}.`); } }} className="h-11 rounded-xl border border-line bg-paper px-3 text-[15px] text-plum-deep">
          <option value="">Or pick a neighborhood</option>
          {HOODS.map((h, i) => <option key={h.name} value={i}>{h.name}</option>)}
        </select>}
        <p className="text-xs text-plum-soft" aria-live="polite">{status}</p>
      </div>
      <div className="grid gap-2">
        <p className="text-sm font-semibold text-plum">Add a place that matters</p>
        <select aria-label="Type of place" value={placeType} onChange={(e) => { setPlaceType(e.target.value); if (place) setPlace({ ...place, type: e.target.value }); }} className="h-11 rounded-xl border border-line bg-paper px-3 text-[15px] text-plum-deep">
          {PLACE_TYPES.map((t) => <option key={t}>{t}</option>)}
        </select>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={placing === "place"} onClick={() => setPlacing(placing === "place" ? null : "place")} className={cn("h-10 rounded-full border px-4 text-sm font-semibold", placing === "place" ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>Tap map to place it</button>
          {place && <button type="button" onClick={() => setPlace(null)} className="h-10 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-plum">Remove</button>}
        </div>
        {isCharlotte && <select aria-label="Or pick a neighborhood for this place" value="" onChange={(e) => { const h = HOODS[Number(e.target.value)]; if (h) setPlace({ ...h.point, type: placeType }); }} className="h-11 rounded-xl border border-line bg-paper px-3 text-[15px] text-plum-deep">
          <option value="">Or pick a neighborhood</option>
          {HOODS.map((h, i) => <option key={h.name} value={i}>{h.name}</option>)}
        </select>}
      </div>
    </div>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
      <div className="grid gap-3">
        {/* Mobile: dropdown panels instead of a long scroll */}
        <div className="flex gap-2 lg:hidden">
          {(["places", "filters"] as const).map((k) => (
            <button key={k} type="button" aria-expanded={panel === k} onClick={() => setPanel(panel === k ? null : k)} className={cn("flex h-11 flex-1 items-center justify-center gap-2 rounded-full border text-sm font-semibold", panel === k ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>
              {k === "places" ? "Home and places" : field ? FIELD_BY_ID[field].name : "Filters"}
              <svg viewBox="0 0 24 24" className={cn("h-4 w-4 transition-transform", panel === k && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M6 9l6 6 6-6" /></svg>
            </button>
          ))}
        </div>
        {panel && (
          <div className="rounded-[var(--radius-card)] border border-line bg-paper p-4 lg:hidden">
            {panel === "places" ? placesControls : <div className="grid gap-4">{fieldSelect}{radiusSlider}</div>}
          </div>
        )}

        <div
          ref={boxRef}
          className={cn("relative h-[62vh] min-h-[380px] touch-none select-none overflow-hidden rounded-3xl border border-line bg-[#EFE6D4] lg:h-[620px]", placing ? "cursor-crosshair" : "cursor-grab")}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          role="application"
          aria-label={`Map of jobs, circles, local places and events around ${cityLabel(city)}`}
        >
          {vb && (
            <svg className="absolute inset-0 h-full w-full" viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`} aria-hidden="true">
              <rect x={-400} y={-400} width={W + 800} height={H + 800} fill="#EFE6D4" />
              {WATER.map((w, i) => <path key={i} d={`${pathD(w)}Z`} fill="#D9E2E4" />)}
              {ROADS.map((r, i) => (
                <g key={i}>
                  <path d={pathD(r)} stroke="#D8C9AE" strokeWidth={7} fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                  <path d={pathD(r)} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
                </g>
              ))}
              {!isCharlotte && Array.from({ length: 31 }, (_, k) => (k - 15) * 0.04).map((d) => {
                const [gx] = toWorld({ lat: CENTER.lat, lng: CENTER.lng + d });
                const [, gy] = toWorld({ lat: CENTER.lat + d, lng: CENTER.lng });
                return <g key={d}><path d={`M${gx} ${-400}V${H + 400}`} stroke="#E3D8C2" strokeWidth={1} vectorEffect="non-scaling-stroke" /><path d={`M${-400} ${gy}H${W + 400}`} stroke="#E3D8C2" strokeWidth={1} vectorEffect="non-scaling-stroke" /></g>;
              })}
              {!isCharlotte && (() => { const [x, y] = toWorld(city); return <text x={x} y={y - 18 * (vb.w / size.w)} textAnchor="middle" fill="#49355F" fontSize={fontSize * 1.3} fontWeight={700}>Downtown {city.name}</text>; })()}
              {LABELS.map(([name, lat, lng]) => { const [x, y] = toWorld({ lat, lng }); return <text key={name} x={x} y={y} textAnchor="middle" fill="#6D5A84" fontSize={fontSize} fontWeight={600}>{name}</text>; })}
            </svg>
          )}

          {vb && (
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute rounded-full border-2 border-dashed border-plum/40 bg-lavender/10" style={{ left: hx, top: hy, width: ringPx * 2, height: ringPx * 2, transform: "translate(-50%,-50%)" }} />
              {items.filter((it): it is Extract<Item, { kind: "local" | "event" }> => it.kind === "local" || it.kind === "event").map((it) => {
                const [sx, sy] = toScreen(it.point);
                const label = it.kind === "local" ? `Local business: ${it.place.title}` : `Event: ${it.event.title}`;
                return <button key={it.id} data-map-ui type="button" aria-label={label} onClick={() => setSel(it.id)} className={cn("pointer-events-auto absolute h-[18px] w-[18px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-paper shadow-[var(--shadow-card)]", it.kind === "local" ? "bg-olive" : "bg-gold", sel === it.id && "outline outline-3 outline-plum")} style={{ left: sx, top: sy }} />;
              })}
              {items.filter((it): it is Extract<Item, { kind: "circle" }> => it.kind === "circle").map((it) => {
                const [sx, sy] = toScreen(it.point);
                return <button key={it.id} data-map-ui type="button" aria-label={`${it.circle.title}, ${it.circle.members} members`} onClick={() => setSel(it.id)} className={cn("pointer-events-auto absolute grid h-7 min-w-7 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-lavender px-1 text-xs font-bold text-plum-deep shadow-[var(--shadow-card)]", sel === it.id && "outline outline-3 outline-plum")} style={{ left: sx, top: sy }}>{it.circle.members}</button>;
              })}
              {groups.map((g) => {
                const first = g.items[0]!;
                if (g.items.length === 1) {
                  const src = first.job.salary.source;
                  return (
                    <button key={first.id} data-map-ui type="button" aria-label={`${first.job.title}, ${payText(first.job)}`} onClick={() => setSel(first.id)} className={cn("pointer-events-auto absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-bold text-plum-deep shadow-[var(--shadow-card)]", src === "employer_listed" ? "bg-peach" : src === "pathd_estimate" ? "bg-[#F8D2C1]" : "bg-[#EADFD4]", sel === first.id && "outline outline-3 outline-plum")} style={{ left: g.x, top: g.y - 6 }}>
                      {pinPay(first.job)}
                    </button>
                  );
                }
                const centroid = toGeo(vb.x + (g.x / size.w) * vb.w, vb.y + (g.y / size.h) * vb.h);
                return (
                  <button key={`g-${first.id}`} data-map-ui type="button" aria-label={`${g.items.length} jobs here. Zoom in`} onClick={() => centerOn(centroid, 0.45)} className="pointer-events-auto absolute -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-full bg-plum px-2.5 py-1 text-xs font-bold text-cream shadow-[var(--shadow-lift)] ring-2 ring-peach" style={{ left: g.x, top: g.y - 6 }}>
                    {g.items.length} jobs
                  </button>
                );
              })}
              <div className="absolute grid -translate-x-1/2 -translate-y-1/2 justify-items-center gap-0.5" style={{ left: hx, top: hy }}>
                <span className="h-[18px] w-[18px] rounded-full border-4 border-paper bg-plum shadow-[0_0_0_2px_#49355F]" />
                <span className="rounded-md bg-paper px-1.5 text-[11px] font-bold text-plum">Home</span>
              </div>
              {place && (() => { const [px, py] = toScreen(place); return (
                <div className="absolute grid -translate-x-1/2 -translate-y-1/2 justify-items-center gap-0.5" style={{ left: px, top: py }}>
                  <span className="h-[18px] w-[18px] rounded-full border-4 border-paper bg-gold shadow-[0_0_0_2px_#49355F]" />
                  <span className="rounded-md bg-paper px-1.5 text-[11px] font-bold text-plum">{place.type}</span>
                </div>
              ); })()}
            </div>
          )}

          <div data-map-ui className="absolute left-3 top-3 flex max-w-[calc(100%-70px)] flex-wrap gap-1.5" role="group" aria-label="Map layers">
            {LAYER_META.map((l) => (
              <button key={l.key} type="button" aria-pressed={layers[l.key]} onClick={() => setLayers({ ...layers, [l.key]: !layers[l.key] })} className={cn("flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[13px] font-semibold text-plum shadow-[var(--shadow-card)]", !layers[l.key] && "opacity-55")}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: l.color }} aria-hidden="true" />
                {l.label}
              </button>
            ))}
          </div>

          <div data-map-ui className="absolute right-3 top-3 grid gap-1.5">
            <button type="button" aria-label="Zoom in" onClick={() => zoom(0.7)} className="h-10 w-10 rounded-xl border border-line bg-paper text-xl font-semibold text-plum shadow-[var(--shadow-card)]">+</button>
            <button type="button" aria-label="Zoom out" onClick={() => zoom(1 / 0.7)} className="h-10 w-10 rounded-xl border border-line bg-paper text-xl font-semibold text-plum shadow-[var(--shadow-card)]">−</button>
            <button type="button" aria-label="Recenter on home" onClick={() => centerOn(home)} className="grid h-10 w-10 place-items-center rounded-xl border border-line bg-paper text-plum shadow-[var(--shadow-card)]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" /></svg>
            </button>
          </div>

          {!sample && (
            <div data-map-ui className="absolute inset-x-3 bottom-10 mx-auto max-w-md rounded-2xl border border-line bg-paper/95 p-4 text-sm shadow-[var(--shadow-lift)]">
              <p className="font-semibold text-plum-deep">PATHD is live in {cityLabel(city)}.</p>
              <p className="mt-1 text-plum-soft">Listings show up here as employers post. Remote jobs are on the Jobs tab. Sample listings are in Charlotte for now.</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {nearbyCities(city, 3).map(({ city: c, miles }) => <button key={c.id} type="button" onClick={() => setCity(c)} className="rounded-full border border-line bg-cream px-3 py-1 text-xs font-semibold text-plum">{c.name} ({Math.round(miles)} mi)</button>)}
                <button type="button" onClick={() => setCity(CHARLOTTE)} className="rounded-full bg-plum px-3 py-1 text-xs font-semibold text-cream">See Charlotte</button>
              </div>
            </div>
          )}
          {placing && <div data-map-ui className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-plum px-4 py-2 text-[13px] font-semibold text-cream">{placing === "home" ? "Tap the map to set where you start" : `Tap the map to place your ${placeType.toLowerCase()}`}</div>}
          <p className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] text-plum-soft">Illustrative map. Straight-line distances.</p>

          {selected && vb && (
            <Preview
              ref={popupRef}
              item={selected}
              anchor={toScreen(selected.point)}
              size={size}
              sheet={isSheet}
              homeLabel={home.label}
              fromHome={milesBetween(home, selected.point)}
              fromPlace={place ? milesBetween(place, selected.point) : null}
              placeType={place?.type ?? null}
              onClose={() => setSel(null)}
            />
          )}
        </div>
      </div>

      <aside className="hidden h-fit gap-5 rounded-[var(--radius-card)] border border-line bg-paper p-5 lg:grid">
        {placesControls}
        <div className="grid gap-4 border-t border-line pt-4">{fieldSelect}{radiusSlider}</div>
      </aside>
    </div>
  );
}

function clampVw(v: number): number {
  return Math.min(Math.max(v, 50), W * 1.6);
}

/* ───────── Zillow-style preview card ───────── */

interface PreviewProps {
  item: Item;
  anchor: [number, number];
  size: { w: number; h: number };
  sheet: boolean;
  homeLabel: string;
  fromHome: number;
  fromPlace: number | null;
  placeType: string | null;
  onClose: () => void;
}

const Preview = forwardRef<HTMLDivElement, PreviewProps>(function Preview({ item, anchor, size, sheet, homeLabel, fromHome, fromPlace, placeType, onClose }, ref) {
  const org = item.kind === "job" ? item.job.company.name : item.kind === "circle" ? item.circle.title : item.kind === "local" ? item.place.title : item.event.title;
  const logo = monogram(org);
  const accent = logo.bg === "#2F2140" ? "#8E7AAB" : logo.bg;
  const scene: SceneType = item.kind === "job" ? item.job.place ?? "tower" : item.kind === "circle" ? "group" : item.kind === "local" ? item.place.scene : item.event.scene;

  const W_CARD = 290;
  const style: CSSProperties = sheet
    ? { left: 10, right: 10, bottom: 10 }
    : (() => {
        const left = Math.min(Math.max(anchor[0] - W_CARD / 2, 10), size.w - W_CARD - 10);
        const above = anchor[1] - 340;
        const top = above >= 10 ? above : Math.min(anchor[1] + 16, size.h - 330);
        return { left, top: Math.max(10, top), width: W_CARD };
      })();

  const onKeyDown = (e: RKeyboardEvent<HTMLDivElement>) => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } };

  return (
    <div ref={ref} data-map-ui tabIndex={-1} role="dialog" aria-label={org} onKeyDown={onKeyDown} className="absolute z-10 overflow-hidden rounded-[18px] border border-line bg-paper shadow-[var(--shadow-lift)]" style={style}>
      <div className={cn("relative bg-lavender-wash", sheet ? "h-[104px]" : "h-[128px]")}>
        <div className="absolute inset-0" dangerouslySetInnerHTML={{ __html: sceneSvg(scene, accent) }} />
        <span className="absolute right-2 top-2 rounded-full bg-plum-deep/75 px-2 py-0.5 text-[10px] font-semibold text-cream">Illustration</span>
        <span aria-hidden="true" className="absolute -bottom-5 left-3 grid h-12 w-12 place-items-center rounded-[14px] border-[3px] border-paper text-[17px] font-extrabold shadow-[var(--shadow-card)]" style={{ background: logo.bg, color: logo.fg }}>{logo.initials}</span>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-paper/90 text-lg font-bold text-plum shadow-[var(--shadow-card)]">×</button>
      </div>
      <div className="px-3.5 pb-3.5 pt-7">
        {item.kind === "job" ? (
          <>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className={cn("font-display text-[22px] leading-tight", item.job.salary.source === "employer_listed" ? "text-plum" : "text-plum-soft")}>{payText(item.job)}</p>
                {item.job.salary.source === "employer_listed" && <span className="mt-1 inline-flex rounded-full bg-plum px-2 py-0.5 text-[11px] font-semibold text-cream">✓ Employer listed</span>}
                {item.job.salary.source === "pathd_estimate" && <span className="mt-1 inline-flex rounded-full border border-dashed border-plum-soft px-2 py-0.5 text-[11px] font-semibold text-plum-soft">PATHD estimate</span>}
              </div>
              <HeartButton jobId={item.job.id} title={item.job.title} />
            </div>
            <h3 className="mt-2 text-base font-bold leading-snug text-plum-deep">{item.job.title}</h3>
            <p className="text-[13px] text-plum-soft">{item.job.company.name}. {workLabel(item.job)}.</p>
          </>
        ) : item.kind === "circle" ? (
          <>
            <span className="inline-flex rounded-full bg-plum px-2 py-0.5 text-[11px] font-bold text-cream">PATHD+</span>
            <h3 className="mt-2 text-base font-bold text-plum-deep">{item.circle.title}</h3>
            <p className="text-[13px] text-plum-soft">{item.circle.members} members. {item.circle.when}.</p>
          </>
        ) : (
          <>
            <span className={cn("inline-flex rounded-full px-2 py-0.5 text-[11px] font-bold", item.kind === "local" ? "bg-olive-wash text-olive-ink" : "bg-gold-wash text-gold-ink")}>{item.kind === "local" ? "Local business" : `Event, ${item.event.when}`}</span>
            <h3 className="mt-2 text-base font-bold text-plum-deep">{item.kind === "local" ? item.place.title : item.event.title}</h3>
            <p className="text-[13px] text-plum-soft">{item.kind === "local" ? item.place.desc : item.event.desc}</p>
          </>
        )}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          <span className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs font-semibold text-plum">{fmtMiles(fromHome)} from home{homeLabel.startsWith("your") ? "" : ` (${homeLabel})`}</span>
          {fromPlace != null && placeType && <span className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-xs font-semibold text-plum">{fmtMiles(fromPlace)} from {placeType.toLowerCase()}</span>}
        </div>
        <div className="mt-3 flex gap-2">
          {item.kind === "job" && <Link href={`/jobs/${item.job.id}`} className="inline-flex h-10 items-center rounded-full bg-peach px-4 text-sm font-semibold text-plum-deep hover:bg-peach-deep">View job</Link>}
          {item.kind === "circle" && <Link href="/pricing" className="inline-flex h-10 items-center rounded-full bg-peach px-4 text-sm font-semibold text-plum-deep">Join with PATHD+</Link>}
        </div>
        <p className="mt-2 text-[11px] text-plum-soft">Sample {item.kind === "job" ? "listing" : "content"}</p>
      </div>
    </div>
  );
});

