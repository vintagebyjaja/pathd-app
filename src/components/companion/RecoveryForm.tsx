"use client";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
export default function RecoveryForm() {
  const [email, setEmail] = useState(""),
    [answers, setAnswers] = useState(["", ""]),
    [code, setCode] = useState(""),
    [password, setPassword] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  async function reset(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const r = await fetch("/api/companion/recovery/reset", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, answers, code, password }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setMessage("Password updated for your shared account. Sign in again.");
      setAnswers(["", ""]);
      setCode("");
      setPassword("");
    } catch (e: any) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section>
      <h1 className="font-display text-3xl">Recover your account</h1>
      <form onSubmit={reset} className="my-5 grid gap-4">
        <label>
          Email
          <input
            className="block w-full rounded-xl border p-3"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        {answers.map((a, i) => (
          <label key={i}>
            Your answer to recovery question {i + 1}
            <input
              required
              type="password"
              className="block w-full rounded-xl border p-3"
              value={a}
              onChange={(e) =>
                setAnswers(
                  answers.map((x, j) => (j === i ? e.target.value : x)),
                )
              }
            />
          </label>
        ))}
        <label>
          Unused recovery code
          <input
            required
            className="block w-full rounded-xl border p-3"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </label>
        <label>
          New password
          <input
            required
            minLength={12}
            type="password"
            className="block w-full rounded-xl border p-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button disabled={busy} className="rounded-xl bg-plum p-3 text-cream">
          {busy ? "Checking…" : "Reset password"}
        </button>
      </form>
      <p role="status">{message}</p>
      <button
        disabled={!email}
        onClick={async () => {
          try {
            const s = createSupabaseBrowserClient();
            const { error } = await s.auth.resetPasswordForEmail(email, {
              redirectTo:
                location.origin + "/auth/callback?next=/reset-password",
            });
            if (error) throw error;
            setMessage("If an account matches, a secure link is on its way.");
          } catch {
            setMessage("Email recovery is temporarily unavailable.");
          }
        }}
      >
        Use secure email recovery instead
      </button>
      <p className="mt-4">
        <a href="/sign-in">Back to sign in</a>
      </p>
    </section>
  );
}
