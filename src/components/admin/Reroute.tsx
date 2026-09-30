"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PathdWordmark } from "@/components/brand/Logo";

const SECONDS = 4;

/**
 * Shown to anyone who isn't PATHD staff on a staff route. Renders no staff
 * data at all: the page never loads its content for non-staff.
 */
export function Reroute({ href, label }: { href: string; label: string }) {
  const router = useRouter();
  const [left, setLeft] = useState(SECONDS);

  useEffect(() => {
    if (left <= 0) {
      router.replace(href);
      return;
    }
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left, href, router]);

  return (
    <main id="main" className="grid min-h-dvh place-items-center bg-cream px-5 py-10" style={{ paddingTop: "max(2.5rem, env(safe-area-inset-top, 0px))" }}>
      <div className="w-full max-w-md text-center">
        <div className="flex justify-center"><PathdWordmark /></div>

        <svg viewBox="0 0 320 200" className="mx-auto mt-8 w-full max-w-[320px]" aria-hidden="true">
          {/* the old road, ending at the barricade */}
          <path d="M20 170 C 80 170, 120 150, 150 110" stroke="#E5D9C4" strokeWidth="16" fill="none" strokeLinecap="round" />
          <path d="M20 170 C 80 170, 120 150, 150 110" stroke="#49355F" strokeWidth="3" strokeDasharray="1 9" fill="none" strokeLinecap="round" />
          {/* barricade */}
          <g transform="translate(128 58)">
            <rect x="0" y="0" width="84" height="26" rx="5" fill="#FFFBF4" stroke="#49355F" strokeWidth="2.5" />
            <path d="M8 0 L22 26 M30 0 L44 26 M52 0 L66 26 M74 0 L84 19" stroke="#F2A889" strokeWidth="8" />
            <rect x="0" y="0" width="84" height="26" rx="5" fill="none" stroke="#49355F" strokeWidth="2.5" />
            <path d="M12 26 V58 M72 26 V58" stroke="#49355F" strokeWidth="4" strokeLinecap="round" />
            <circle cx="6" cy="-6" r="5" fill="#C6A15B" className="reroute-blink" />
            <circle cx="78" cy="-6" r="5" fill="#C6A15B" className="reroute-blink" />
          </g>
          {/* the new route, drawing itself */}
          <path className="reroute-draw" d="M20 170 C 90 172, 150 180, 210 160 S 290 110, 300 60" stroke="#49355F" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <circle cx="300" cy="60" r="9" fill="#FFFBF4" stroke="#C6A15B" strokeWidth="4" />
          <circle cx="20" cy="170" r="9" fill="#FFFBF4" stroke="#49355F" strokeWidth="4" />
        </svg>

        <h1 className="mt-6 font-display text-4xl text-plum">Road closed ahead</h1>
        <p className="mt-3 text-plum-soft">This route is reserved for the PATHD Team.</p>
        <p className="mt-6 font-semibold text-plum-deep" role="status" aria-live="polite">
          Rerouting you to {label}{left > 0 ? ` in ${left}…` : "…"}
        </p>
        <a href={href} className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-peach px-6 font-semibold text-plum-deep hover:bg-peach-deep">
          Take me there now
        </a>
      </div>

      <style>{`
        .reroute-draw{stroke-dasharray:420;stroke-dashoffset:420;animation:reroute-draw ${SECONDS - 0.6}s ease-in-out .3s forwards}
        @keyframes reroute-draw{to{stroke-dashoffset:0}}
        .reroute-blink{animation:reroute-blink 1s steps(2,end) infinite}
        .reroute-blink:last-of-type{animation-delay:.5s}
        @keyframes reroute-blink{50%{opacity:.25}}
        @media (prefers-reduced-motion: reduce){.reroute-draw{animation:none;stroke-dashoffset:0}.reroute-blink{animation:none}}
      `}</style>
    </main>
  );
}

const KEY = "pathd-mc-steps";

export function StepChecklist({ steps }: { steps: [string, string][] }) {
  const [done, setDone] = useState<Record<number, boolean>>({});
  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(KEY) ?? "{}") ?? {});
    } catch {
      setDone({});
    }
  }, []);
  const toggle = (i: number, v: boolean) => {
    const next = { ...done, [i]: v };
    setDone(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable: keep in memory */
    }
  };
  return (
    <ol className="grid">
      {steps.map(([task, who], i) => (
        <li key={task} className="flex items-start gap-3 border-t border-line py-3 first:border-t-0">
          <input id={`step-${i}`} type="checkbox" checked={!!done[i]} onChange={(e) => toggle(i, e.target.checked)} className="mt-1 h-5 w-5 accent-plum" />
          <label htmlFor={`step-${i}`} className={done[i] ? "text-plum-soft line-through" : "text-plum-deep"}>{task}</label>
          <span className="ml-auto shrink-0 rounded-full bg-peach-wash px-2.5 py-0.5 text-xs font-semibold text-plum">{who}</span>
        </li>
      ))}
    </ol>
  );
}
