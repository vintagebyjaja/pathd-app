"use client";
import { useState, useEffect } from "react";
async function api(path: string, method = "GET", data?: unknown) {
  const r = await fetch("/api/companion/career" + path, {
    method,
    headers: { "content-type": "application/json" },
    body: data === undefined ? undefined : JSON.stringify(data),
  });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error);
  return d;
}
export default function CareerTools() {
  const [items, setItems] = useState<any[]>([]),
    [notes, setNotes] = useState<any[]>([]),
    [records, setRecords] = useState<any[]>([]),
    [error, setError] = useState(""),
    [title, setTitle] = useState(""),
    [due, setDue] = useState(""),
    [repeat, setRepeat] = useState("once"),
    [source, setSource] = useState("");
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  async function refresh() {
    try {
      const [r, n, c] = await Promise.all([
        api("/reminders"),
        api("/notifications"),
        api("/records"),
      ]);
      setItems(r.items);
      setNotes(n.items);
      setRecords(c.items);
    } catch (e: any) {
      setError(e.message);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  async function act(fn: () => Promise<any>) {
    try {
      await fn();
      refresh();
    } catch (e: any) {
      setError(e.message);
    }
  }
  return (
    <section className="rounded-2xl border border-line bg-paper p-5">
      <h2 className="font-display text-2xl">Reminders & follow-through</h2>
      <p className="my-3 text-sm">
        In-app reminders use {zone}. Job monitoring is not connected yet.
      </p>
      {error && <p role="alert">{error}</p>}
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          act(() =>
            api("/reminders", "POST", {
              title,
              due_at: new Date(due).toISOString(),
              timezone: zone,
              recurrence: repeat,
              source_id: source || null,
            }),
          );
        }}
      >
        <label>
          Reminder
          <input
            required
            className="block w-full rounded-xl border p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          When
          <input
            required
            type="datetime-local"
            className="block w-full rounded-xl border p-3"
            value={due}
            onChange={(e) => setDue(e.target.value)}
          />
        </label>
        <label>
          Repeat
          <select
            className="block w-full rounded-xl border p-3"
            value={repeat}
            onChange={(e) => setRepeat(e.target.value)}
          >
            <option>once</option>
            <option>daily</option>
            <option>weekly</option>
          </select>
        </label>
        <label>
          Related opportunity
          <select
            className="block w-full rounded-xl border p-3"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            <option value="">None</option>
            {records.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title}
              </option>
            ))}
          </select>
        </label>
        <button className="rounded-xl bg-plum p-3 text-cream">
          Create reminder
        </button>
      </form>
      {items.map((r) => (
        <article key={r.id} className="my-3 rounded-xl bg-lavender-wash p-4">
          <b>{r.title}</b>
          <p>
            {new Date(r.due_at).toLocaleString()} · {r.recurrence}{" "}
            {r.paused ? " · Paused" : ""}
          </p>
          <button
            className="mr-3 underline"
            onClick={() =>
              act(() =>
                api("/reminders/" + r.id, "PATCH", { paused: !r.paused }),
              )
            }
          >
            {r.paused ? "Resume" : "Pause"}
          </button>
          <button
            className="mr-3 underline"
            onClick={() => {
              const time = prompt("New ISO date/time with timezone", r.due_at);
              if (time)
                act(() => api("/reminders/" + r.id, "PATCH", { due_at: time }));
            }}
          >
            Reschedule
          </button>
          <button
            className="underline"
            onClick={() => act(() => api("/reminders/" + r.id, "DELETE"))}
          >
            Delete
          </button>
        </article>
      ))}
      <h3 className="mt-5 font-semibold">Notifications</h3>
      {notes.map((n) => (
        <p key={n.id} className="my-2">
          {n.title} · {new Date(n.scheduled_for).toLocaleString()}{" "}
          {!n.read_at && (
            <button
              className="underline"
              onClick={() =>
                act(() => api("/notifications/" + n.id, "PATCH", {}))
              }
            >
              Mark read
            </button>
          )}
        </p>
      ))}
      <button className="mt-4 underline" onClick={refresh}>
        Refresh notification history
      </button>
    </section>
  );
}
