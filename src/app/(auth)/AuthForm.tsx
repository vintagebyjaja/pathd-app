"use client";

import { useActionState } from "react";
import type { AuthState } from "./actions";
import { Button } from "@/components/ui/Button";

type Action = (state: AuthState, form: FormData) => Promise<AuthState>;

export function AuthForm({ action, submitLabel, next, demo }: { action: Action; submitLabel: string; next?: string; demo: boolean }) {
  const [state, formAction, pending] = useActionState(action, {});
  const field = "mt-1.5 h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-[15px] text-plum-deep";
  return (
    <form action={formAction} className="grid gap-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {demo ? (
        <p className="rounded-xl bg-lavender-wash p-3 text-sm text-plum">
          Accounts aren&apos;t connected yet, so this continues in demo mode with a fictional member.
        </p>
      ) : (
        <>
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-plum">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required className={field} />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-semibold text-plum">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={submitLabel === "Create account" ? "new-password" : "current-password"}
              required
              className={field}
            />
          </div>
        </>
      )}
      <div aria-live="polite" className="min-h-5 text-sm">
        {state.error && <p className="text-[#9b2c2c]">{state.error}</p>}
        {state.message && <p className="text-olive-ink">{state.message}</p>}
      </div>
      <Button type="submit" variant="action" size="lg" disabled={pending}>
        {pending ? "One moment…" : demo ? "Continue in demo mode" : submitLabel}
      </Button>
    </form>
  );
}
