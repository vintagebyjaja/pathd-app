"use client";
import { useState } from "react";
export default function AskMila({
  title,
  context,
}: {
  title: string;
  context: Record<string, unknown>;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div>
      <button
        className="my-3 rounded-xl bg-plum px-5 py-3 text-cream"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const r = await fetch("/api/companion/career/records", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ kind: "job", title, data: context }),
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error);
            location.assign("/companion?agent=mila");
          } catch (e: any) {
            setError(e.message);
            setBusy(false);
          }
        }}
      >
        {busy ? "Opening…" : "Ask MILA about this job"}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
