"use client";
import { useState } from "react";
export default function ImportCareer() {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  return (
    <div className="rounded-xl bg-lavender-wash p-4">
      <p>
        With your permission, import your current PATHD career profile for MILA.
        No private career details are placed in a URL.
      </p>
      <button
        className="mt-3 underline"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            const r = await fetch("/api/companion/career/import", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ consent: true }),
            });
            const d = await r.json();
            if (!r.ok) throw new Error(d.error);
            setMessage("Your authorized career profile was saved for MILA.");
          } catch (e: any) {
            setMessage(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        Import my career profile
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
