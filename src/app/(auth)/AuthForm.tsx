"use client";

import Captcha from "./Captcha";
import { useActionState } from "react";
import type { AuthState } from "./actions";
import { Button } from "@/components/ui/Button";

type Action = (state: AuthState, form: FormData) => Promise<AuthState>;

export function AuthForm({
  action,
  submitLabel,
  next,
  demo,
}: {
  action: Action;
  submitLabel: string;
  next?: string;
  demo: boolean;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const signup = submitLabel === "Create account";
  const field =
    "mt-1.5 h-12 w-full rounded-xl border border-line bg-paper px-3.5 text-[15px] text-plum-deep";
  if (state.codes?.length)
    return (
      <section>
        <p>{state.message}</p>
        <pre className="overflow-auto rounded-xl bg-lavender-wash p-4">
          {state.codes.join("\n")}
        </pre>
        <button
          onClick={() => {
            const url = URL.createObjectURL(
              new Blob([state.codes!.join("\n")], { type: "text/plain" }),
            );
            const a = document.createElement("a");
            a.href = url;
            a.download = "shared-recovery-codes.txt";
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
          }}
        >
          Download recovery codes
        </button>
        <p>
          <a href="/home">I saved them — continue</a>
        </p>
      </section>
    );
  return (
    <form action={formAction} className="grid gap-4" noValidate>
      {next && <input type="hidden" name="next" value={next} />}
      {demo ? (
        <p className="rounded-xl bg-lavender-wash p-3 text-sm text-plum">
          Accounts aren&apos;t connected yet, so this continues in demo mode
          with a fictional member.
        </p>
      ) : (
        <>
          {signup && (
            <div>
              <label htmlFor="display_name">Preferred name</label>
              <input
                id="display_name"
                name="display_name"
                required
                className={field}
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="text-sm font-semibold text-plum">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={field}
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-plum"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={
                submitLabel === "Create account"
                  ? "new-password"
                  : "current-password"
              }
              required
              className={field}
            />
          </div>
        </>
      )}
      {signup && !demo && (
        <>
          <p className="text-sm">
            Choose two different recovery questions. Your password stays unchanged.
            Questions alone cannot reset a password; secure email recovery is available.
          </p>
          {[1, 2].map((i) => (
            <div key={i}>
              <label htmlFor={"q" + i}>Recovery question {i}</label>
              <input
                id={"q" + i}
                name={"question" + i}
                required
                minLength={8}
                maxLength={160}
                placeholder="Write your personal recovery question"
                className={field}
              />
              <label htmlFor={"a" + i}>Your answer</label>
              <input
                id={"a" + i}
                name={"answer" + i}
                type="password"
                required
                minLength={3}
                maxLength={200}
                className={field}
              />
            </div>
          ))}
        </>
      )}
      {!signup && (
        <a className="text-sm underline" href="/forgot-password">
          Forgot password?
        </a>
      )}
      {signup && !demo && <Captcha />}
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
