import { cn } from "@/lib/env";

/**
 * Simplified flat PATHD mark for UI sizes: a tree whose branches end in
 * people, rooted in paths. The detailed illustrated logo lives at
 * /brand/pathd-logo.png for marketing use.
 */
export function PathdMark({ className, title = "PATHD" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("h-8 w-8", className)} role="img" aria-label={title}>
      {/* roots / paths */}
      <path d="M24 40c-4 0-9 1.5-14 4M24 40c4 0 9 1.5 14 4" stroke="#C6A15B" strokeWidth="2.2" fill="none" strokeLinecap="round" />
      {/* trunk splitting into three branches */}
      <path d="M24 41V27c0-3-2-5-5.5-7.5" stroke="#49355F" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M24 27c0-3 2-5 5.5-7.5" stroke="#747A4C" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      <path d="M24 30V17" stroke="#F2A889" strokeWidth="3.2" fill="none" strokeLinecap="round" />
      {/* people */}
      <circle cx="24" cy="12" r="3.6" fill="#49355F" />
      <circle cx="15.5" cy="16.5" r="3.2" fill="#F2A889" />
      <circle cx="32.5" cy="16.5" r="3.2" fill="#C9B8E4" />
      {/* leaves */}
      <path d="M9 23c2.5-3.5 6-4 8-3-1.5 3-5 4.5-8 3z" fill="#747A4C" />
      <path d="M39 23c-2.5-3.5-6-4-8-3 1.5 3 5 4.5 8 3z" fill="#C6A15B" />
      <path d="M19 6c1-2.5 3-3.5 4.5-3.2-.5 2.3-2.4 3.6-4.5 3.2z" fill="#C9B8E4" />
      <path d="M29 6c-1-2.5-3-3.5-4.5-3.2.5 2.3 2.4 3.6 4.5 3.2z" fill="#747A4C" />
    </svg>
  );
}

export function PathdWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <PathdMark />
      <span className="font-display text-2xl leading-none tracking-[0.06em] text-plum">PATHD</span>
    </span>
  );
}
