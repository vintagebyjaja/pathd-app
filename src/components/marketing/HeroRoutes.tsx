"use client";

import { useState } from "react";
import type { KeyboardEvent as RKeyboardEvent } from "react";
import { cn } from "@/lib/env";

interface RouteExample { tab: string; steps: [string, string, string, string]; pay: string; title: string; meta: string; match: number }

const ROUTES: RouteExample[] = [
  { tab: "Nursing", steps: ["CNA", "Registered Nurse", "Charge Nurse", "Nurse Manager"], pay: "$38–$52/hr", title: "Registered Nurse, Med-Surg", meta: "In person, 2.1 miles away. 4 connections work here.", match: 91 },
  { tab: "Tech", steps: ["IT Support Specialist", "Software Engineer", "Senior Engineer", "Engineering Manager"], pay: "$105K–$130K", title: "Software Engineer II", meta: "Hybrid, 4.1 miles away. 2 connections work here.", match: 93 },
  { tab: "Finance", steps: ["Financial Analyst", "Senior Analyst", "Finance Manager", "Director of FP&A"], pay: "$90K–$110K", title: "Credit Risk Analyst", meta: "Hybrid, 6.3 miles away. 5 connections work here.", match: 88 },
  { tab: "Business", steps: ["Business Development Rep", "Account Executive", "Sales Manager", "VP of Sales"], pay: "$80K–$95K", title: "Operations Manager", meta: "In person, 5.8 miles away. 1 connection works here.", match: 86 },
  { tab: "Design", steps: ["Architectural Designer", "Project Designer", "Project Architect", "Design Manager"], pay: "$78K–$92K", title: "Project Designer", meta: "Hybrid, 3.4 miles away. 3 connections work here.", match: 92 },
];

const NOTES = ["You are here", "Next waypoint, 82% ready", "Waypoint 02", "Career goal"];
const POS: { left: string; top: string; center?: boolean }[] = [
  { left: "20.5%", top: "84.8%" }, { left: "65.7%", top: "62.8%" }, { left: "41.9%", top: "34.8%" }, { left: "78.6%", top: "18.8%", center: true },
];
const NODES: { x: number; y: number; c: string }[] = [
  { x: 60, y: 440, c: "#49355F" }, { x: 250, y: 330, c: "#F2A889" }, { x: 150, y: 190, c: "#C9B8E4" }, { x: 330, y: 70, c: "#C6A15B" },
];
const PATH = "M60 440 C 150 440, 300 400, 250 330 S 60 260, 150 190 S 360 150, 330 70";

/** Hero: example career routes by field. Tabs follow the ARIA tabs pattern. */
export function HeroRoutes() {
  const [i, setI] = useState<number>(0);
  const r = ROUTES[i] ?? ROUTES[0]!;

  const onKeyDown = (e: RKeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const n = (i + (e.key === "ArrowRight" ? 1 : ROUTES.length - 1)) % ROUTES.length;
    setI(n);
    document.getElementById(`route-tab-${n}`)?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Example career routes" onKeyDown={onKeyDown} className="mx-auto mb-4 flex max-w-[460px] flex-wrap gap-1.5">
        {ROUTES.map((x, n) => (
          <button key={x.tab} id={`route-tab-${n}`} type="button" role="tab" aria-selected={n === i} aria-controls="route-panel" tabIndex={n === i ? 0 : -1} onClick={() => setI(n)} className={cn("rounded-full border px-3.5 py-1.5 text-sm font-semibold", n === i ? "border-plum bg-plum text-cream" : "border-line bg-paper text-plum")}>
            {x.tab}
          </button>
        ))}
      </div>
      <figure id="route-panel" role="tabpanel" aria-labelledby={`route-tab-${i}`} className="relative mx-auto w-full max-w-[460px]">
        <div className="relative z-10 mb-3 w-[236px] -rotate-2 rounded-[18px] border border-line bg-paper px-3.5 py-3 shadow-[var(--shadow-lift)] sm:absolute sm:-left-6 sm:-top-1 sm:mb-0 sm:-rotate-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-[21px] leading-tight text-plum">{r.pay}</p>
              <span className="mt-1 inline-flex whitespace-nowrap rounded-full bg-plum px-2 py-0.5 text-[11px] font-semibold text-cream">✓ Employer listed</span>
            </div>
            <span className="whitespace-nowrap rounded-full bg-plum px-2 py-0.5 text-xs font-semibold text-cream">{r.match}% match</span>
          </div>
          <p className="mt-2 font-bold leading-tight text-plum-deep">{r.title}</p>
          <p className="text-xs leading-snug text-plum-soft">{r.meta} Example listing.</p>
        </div>
        <div className="relative">
          <svg viewBox="0 0 420 500" className="w-full" aria-hidden="true">
            <path d={PATH} fill="none" stroke="#E5D9C4" strokeWidth="18" strokeLinecap="round" />
            <path key={r.tab} className="route-draw" d={PATH} fill="none" stroke="#49355F" strokeWidth="3" strokeLinecap="round" />
            {NODES.map((nd) => (
              <g key={`${nd.x}-${nd.y}`}>
                <circle cx={nd.x} cy={nd.y} r="16" fill="#FFFBF4" stroke={nd.c} strokeWidth="5" />
                <circle cx={nd.x} cy={nd.y} r="5" fill={nd.c} />
              </g>
            ))}
          </svg>
          <ol className="pointer-events-none absolute inset-0 text-sm">
            {r.steps.map((s, n) => {
              const p = POS[n]!;
              return (
                <li key={s} className="absolute max-w-[40%]" style={{ left: p.left, top: p.top, transform: p.center ? "translateX(-50%)" : undefined, textAlign: p.center ? "center" : undefined }}>
                  <span className="sr-only">Step {n + 1}: </span>
                  <span className="block font-semibold leading-tight text-plum-deep">{s}</span>
                  <span className="block text-xs text-plum-soft">{NOTES[n]}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </figure>
    </div>
  );
}
