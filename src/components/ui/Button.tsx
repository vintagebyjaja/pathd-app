import Link from "next/link";
import { cn } from "@/lib/env";

type Variant = "primary" | "action" | "ghost" | "outline";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-plum text-cream hover:bg-plum-deep",
  action: "bg-peach text-plum-deep hover:bg-peach-deep",
  outline: "border border-plum/25 text-plum hover:border-plum hover:bg-paper",
  ghost: "text-plum hover:bg-plum/5",
};
const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size };

export function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={buttonClasses(variant, size, className)} {...props} />;
}

type LinkButtonProps = React.ComponentProps<typeof Link> & { variant?: Variant; size?: Size };

export function LinkButton({ variant, size, className, ...props }: LinkButtonProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}

export function DemoBadge() {
  return (
    <span className="inline-flex items-center rounded-full border border-dashed border-plum/30 px-2 py-0.5 text-[11px] font-medium text-plum-soft" title="Fictional demo data, not a real listing">
      Demo
    </span>
  );
}

export function DemoBanner() {
  return (
    <div role="status" className="bg-plum-deep px-4 py-2 text-center text-[13px] text-cream/90">
      Demo mode: every job, company and person you see is fictional. Connect Supabase to use real data.
    </div>
  );
}

export function EmptyState({ title, body, action }: { title: string; body: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-paper/60 px-6 py-12 text-center">
      <h2 className="font-display text-xl text-plum">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-plum-soft">{body}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
