"use client";
import { useState, useEffect } from "react";
const questions = [
  "What was a nickname only your family used?",
  "What place holds a special memory for you?",
  "What was the name of your first creative project?",
];
export default function SecuritySetup() {
  const [generateCodes,setGenerateCodes] = useState(false);
  const [account, setAccount] = useState<any>(null),
    [password, setPassword] = useState(""),
    [answers, setAnswers] = useState(["", ""]),
    [qs, setQs] = useState(questions.slice(0, 2)),
    [codes, setCodes] = useState<string[]>([]),
    [error, setError] = useState(""),
    [editing, setEditing] = useState(false),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch("/api/companion/account")
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setAccount(d);
        setEditing(!d.user.recovery_enrolled);
      })
      .catch((e) => setError(e.message));
  }, []);
  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/companion/recovery/enroll", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, questions: qs, answers, generate_codes: generateCodes }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      setCodes(d.codes || []);
      setPassword("");
      setAnswers(["", ""]);
      setEditing(false);
      dispatchEvent(new Event("shared-recovery-enrolled"));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="rounded-2xl border border-line bg-paper p-6">
      <h1 className="font-display text-3xl text-plum">Account security</h1>
      <a href="/home">Back to PATHD</a> · <a href="/explore">Explore the free site</a>
      <p className="my-3">
        Your existing identity works on AELIO and PATHD. Enroll once; no new
        registration needed.
      </p>
      {error && <p role="alert">{error}</p>}
      {account && (
        <>
          <p>{account.user.email}</p>
          <h2>Connected applications</h2>
          {account.plans.map((p: any) => (
            <p key={p.product}>
              {p.product.toUpperCase()} — Connected · {p.plan} · {p.credits}{" "}
              message credits
            </p>
          ))}
          <p>Subscriptions stay separate. Paid plans are Coming Soon.</p>
          {!editing && (
            <button
              className="my-3 rounded-xl bg-plum p-3 text-cream"
              onClick={() => setEditing(true)}
            >
              Update recovery methods
            </button>
          )}
        </>
      )}
      {editing && (
        <form className="grid max-w-xl gap-4" onSubmit={save}>
          {[0, 1].map((i) => (
            <label key={i}>
              Recovery question {i + 1}
              <select
                className="block w-full rounded-xl border border-line p-3"
                value={questions.includes(qs[i] || "") ? qs[i] : "custom"}
                onChange={(e) =>
                  setQs(
                    qs.map((q, j) =>
                      j === i
                        ? e.target.value === "custom"
                          ? ""
                          : e.target.value
                        : q,
                    ),
                  )
                }
              >
                {questions.map((q) => (
                  <option key={q}>{q}</option>
                ))}
                <option value="custom">Write my own</option>
              </select>
              {!questions.includes(qs[i] || "") && (
                <input
                  required
                  aria-label={"Custom question " + (i + 1)}
                  className="block w-full rounded-xl border p-3"
                  value={qs[i]}
                  onChange={(e) =>
                    setQs(qs.map((q, j) => (j === i ? e.target.value : q)))
                  }
                />
              )}
              <input
                required
                aria-label={"Recovery answer " + (i + 1)}
                type="password"
                className="mt-2 block w-full rounded-xl border border-line p-3"
                value={answers[i]}
                onChange={(e) =>
                  setAnswers(
                    answers.map((a, j) => (j === i ? e.target.value : a)),
                  )
                }
              />
            </label>
          ))}
          <label>
            Confirm current password
            <input
              required
              type="password"
              autoComplete="current-password"
              className="block w-full rounded-xl border border-line p-3"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
          <p>
            Saving answers leaves your password unchanged. Questions alone cannot
            reset a password; secure email recovery remains available.
          </p>
          <label><input type="checkbox" checked={generateCodes} onChange={(e)=>setGenerateCodes(e.target.checked)} /> Also generate new backup codes (optional; replaces old codes)</label>
          <button disabled={busy} className="rounded-xl bg-plum p-3 text-cream">
            {busy ? "Saving…" : "Save recovery answers"}
          </button>
        </form>
      )}
      {codes.length > 0 && (
        <div>
          <h2 className="mt-4 text-xl">Save these single-use codes</h2>
          <pre className="overflow-auto rounded-xl bg-lavender-wash p-4">
            {codes.join("\n")}
          </pre>
          <button
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([codes.join("\n")], { type: "text/plain" }),
              );
              const a = document.createElement("a");
              a.href = url;
              a.download = "PATHD-shared-recovery-codes.txt";
              a.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            Download codes
          </button>
        </div>
      )}
    </section>
  );
}
