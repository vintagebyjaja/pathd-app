"use client";

import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  PORTFOLIO_BUCKET,
  PORTFOLIO_MAX_BYTES,
  PORTFOLIO_MAX_ITEMS,
  VISIBILITY_HELP,
  VISIBILITY_LABEL,
  formatBytes,
  looksLikePdf,
  type PortfolioItemView,
  type PortfolioVisibility,
} from "@/lib/portfolio/types";
import { cn } from "@/lib/env";

type Busy = { kind: "idle" } | { kind: "uploading"; name: string } | { kind: "working"; id: string };
interface LocalItem extends PortfolioItemView { localUrl?: string }

const VIS_ORDER: PortfolioVisibility[] = ["private", "link", "connections", "employers"];

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { ...init, headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } });
  const json = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) throw new Error(json.error ?? "Something went wrong.");
  return json;
}

/**
 * Portfolio portal: upload PDF portfolios (25 MB max), choose who sees each
 * one, and share private links with employers, firms, clients and peers.
 * In demo mode files stay in this browser tab and are never uploaded.
 */
export function PortfolioManager({ initialItems, demo }: { initialItems: PortfolioItemView[]; demo: boolean }) {
  const [items, setItems] = useState<LocalItem[]>(initialItems);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState<Busy>({ kind: "idle" });
  const [message, setMessage] = useState<{ tone: "error" | "ok"; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Release demo preview URLs when leaving the page.
  const itemsRef = useRef<LocalItem[]>(items);
  useEffect(() => { itemsRef.current = items; }, [items]);
  useEffect(() => () => { (itemsRef.current ?? []).forEach((i: LocalItem) => { if (i.localUrl) URL.revokeObjectURL(i.localUrl); }); }, []);

  async function choose(f: File | undefined) {
    setMessage(null);
    if (!f) return;
    if (f.type !== "application/pdf" && !f.name.toLowerCase().endsWith(".pdf")) return setMessage({ tone: "error", text: "Portfolios must be PDF files." });
    if (f.size > PORTFOLIO_MAX_BYTES) return setMessage({ tone: "error", text: `That file is ${formatBytes(f.size)}. Portfolios can be up to 25 MB.` });
    const head = new Uint8Array(await f.slice(0, 5).arrayBuffer());
    if (!looksLikePdf(head)) return setMessage({ tone: "error", text: "That file doesn't look like a real PDF. Export it as PDF and try again." });
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.pdf$/i, "").replace(/[_-]+/g, " ").slice(0, 120));
  }

  async function upload() {
    if (!file) return setMessage({ tone: "error", text: "Choose a PDF first." });
    if (!title.trim()) return setMessage({ tone: "error", text: "Add a title so people know what they're opening." });
    if (items.length >= PORTFOLIO_MAX_ITEMS) return setMessage({ tone: "error", text: "You can keep up to 10 portfolio files. Delete one to add another." });
    setMessage(null);
    setBusy({ kind: "uploading", name: file.name });

    if (demo) {
      const local: LocalItem = {
        id: `local-${Date.now()}`, title: title.trim(), description: description.trim() || null, sizeBytes: file.size,
        status: "ready", visibility: "private", createdAt: new Date().toISOString(), shareUrl: null, localUrl: URL.createObjectURL(file),
      };
      setItems((cur: LocalItem[]) => [local, ...cur]);
      reset("Added in demo mode. It stays in this browser tab and isn't uploaded.");
      return;
    }

    try {
      const start = await api<{ id: string; path: string; token: string }>("/api/portfolio/upload-url", {
        method: "POST",
        body: JSON.stringify({ title: title.trim(), description: description.trim() || undefined, fileName: file.name, size: file.size, type: "application/pdf" }),
      });
      const { createSupabaseBrowserClient } = await import("@/lib/supabase/browser");
      const sb = createSupabaseBrowserClient();
      const { error } = await sb.storage.from(PORTFOLIO_BUCKET).uploadToSignedUrl(start.path, start.token, file, { contentType: "application/pdf" });
      if (error) throw new Error("The upload didn't finish. Check your connection and try again.");
      const done = await api<{ item: PortfolioItemView }>(`/api/portfolio/${start.id}/finalize`, { method: "POST" });
      setItems((cur: LocalItem[]) => [done.item, ...cur]);
      reset("Uploaded. It's private until you choose who can see it.");
    } catch (e) {
      setBusy({ kind: "idle" });
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Upload failed." });
    }
  }

  function reset(text: string) {
    setFile(null);
    setTitle("");
    setDescription("");
    if (inputRef.current) inputRef.current.value = "";
    setBusy({ kind: "idle" });
    setMessage({ tone: "ok", text });
  }

  async function setVisibility(item: LocalItem, v: PortfolioVisibility) {
    if (demo) {
      setItems((cur: LocalItem[]) => cur.map((i: LocalItem) => (i.id === item.id ? { ...i, visibility: v, shareUrl: v === "private" ? null : i.shareUrl } : i)));
      return;
    }
    setBusy({ kind: "working", id: item.id });
    try {
      const r = await api<{ item: PortfolioItemView }>(`/api/portfolio/${item.id}`, { method: "PATCH", body: JSON.stringify({ visibility: v }) });
      setItems((cur: LocalItem[]) => cur.map((i: LocalItem) => (i.id === item.id ? r.item : i)));
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Couldn't save." });
    }
    setBusy({ kind: "idle" });
  }

  async function share(item: LocalItem) {
    if (demo) return setMessage({ tone: "error", text: "Share links work once PATHD accounts are connected." });
    setBusy({ kind: "working", id: item.id });
    try {
      const r = await api<{ shareUrl: string }>(`/api/portfolio/${item.id}/share`, { method: "POST" });
      setItems((cur: LocalItem[]) => cur.map((i: LocalItem) => (i.id === item.id ? { ...i, shareUrl: r.shareUrl, visibility: i.visibility === "private" ? "link" : i.visibility } : i)));
      await copy(item.id, r.shareUrl);
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Couldn't create a link." });
    }
    setBusy({ kind: "idle" });
  }

  async function unshare(item: LocalItem) {
    setBusy({ kind: "working", id: item.id });
    try {
      await api<{ ok: true }>(`/api/portfolio/${item.id}/share`, { method: "DELETE" });
      setItems((cur: LocalItem[]) => cur.map((i: LocalItem) => (i.id === item.id ? { ...i, shareUrl: null } : i)));
      setMessage({ tone: "ok", text: "Link turned off. Anyone with the old link can no longer open it." });
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Couldn't turn off the link." });
    }
    setBusy({ kind: "idle" });
  }

  async function remove(item: LocalItem) {
    if (!window.confirm(`Delete "${item.title}"? This can't be undone, and any share links stop working.`)) return;
    if (demo || item.localUrl) {
      if (item.localUrl) URL.revokeObjectURL(item.localUrl);
      setItems((cur: LocalItem[]) => cur.filter((i: LocalItem) => i.id !== item.id));
      return;
    }
    setBusy({ kind: "working", id: item.id });
    try {
      await api<{ ok: true }>(`/api/portfolio/${item.id}`, { method: "DELETE" });
      setItems((cur: LocalItem[]) => cur.filter((i: LocalItem) => i.id !== item.id));
    } catch (e) {
      setMessage({ tone: "error", text: e instanceof Error ? e.message : "Couldn't delete." });
    }
    setBusy({ kind: "idle" });
  }

  async function copy(id: string, url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied((c: string | null) => (c === id ? null : c)), 2500);
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  const uploading = busy.kind === "uploading";

  return (
    <section aria-labelledby="h-portfolio" className="rounded-[var(--radius-card)] border border-line bg-paper p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="h-portfolio" className="font-display text-2xl text-plum">Portfolio</h2>
        <span className="text-xs text-plum-soft">{items.length} of {PORTFOLIO_MAX_ITEMS} files</span>
      </div>
      <p className="mt-1 text-sm text-plum-soft">Share your work with employers, firms, clients and peers. PDF, up to 25 MB. Private until you share it.</p>
      {demo && <p className="mt-3 rounded-xl bg-lavender-wash p-3 text-sm text-plum">Demo mode: files you add stay in this browser tab and aren&apos;t uploaded.</p>}

      <div
        className={cn("mt-5 grid gap-3 rounded-2xl border-2 border-dashed p-4 transition-colors", file ? "border-plum bg-cream" : "border-line bg-cream/50")}
        onDragOver={(e: DragEvent<HTMLDivElement>) => e.preventDefault()}
        onDrop={(e: DragEvent<HTMLDivElement>) => { e.preventDefault(); void choose(e.dataTransfer.files[0]); }}
      >
        <input ref={inputRef} id="portfolio-file" type="file" accept="application/pdf,.pdf" className="sr-only" onChange={(e: ChangeEvent<HTMLInputElement>) => void choose(e.target.files?.[0])} />
        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor="portfolio-file" className="inline-flex h-11 cursor-pointer items-center rounded-full bg-plum px-5 text-sm font-semibold text-cream">{file ? "Choose a different PDF" : "Choose a PDF"}</label>
          <span className="text-sm text-plum-soft">{file ? `${file.name}, ${formatBytes(file.size)}` : "or drag it here"}</span>
        </div>
        {file && (
          <>
            <label className="grid gap-1 text-sm font-semibold text-plum">
              Title
              <input value={title} maxLength={120} onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)} className="h-11 rounded-xl border border-line bg-paper px-3 text-[15px] font-normal text-plum-deep" />
            </label>
            <label className="grid gap-1 text-sm font-semibold text-plum">
              Short description <span className="font-normal text-plum-soft">(optional)</span>
              <textarea value={description} maxLength={500} rows={2} onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)} className="rounded-xl border border-line bg-paper px-3 py-2 text-[15px] font-normal text-plum-deep" />
            </label>
            <button type="button" onClick={() => void upload()} disabled={uploading} className="inline-flex h-11 items-center justify-center rounded-full bg-peach px-5 font-semibold text-plum-deep hover:bg-peach-deep disabled:opacity-60 sm:justify-self-start">
              {uploading ? "Uploading…" : "Upload portfolio"}
            </button>
            {uploading && <div className="h-1.5 overflow-hidden rounded-full bg-line" aria-hidden="true"><div className="h-full w-1/3 animate-pulse rounded-full bg-plum" /></div>}
          </>
        )}
      </div>

      <div aria-live="polite" className="min-h-6 pt-3 text-sm">
        {message && <p className={message.tone === "error" ? "text-[#9b2c2c]" : "text-olive-ink"}>{message.text}</p>}
      </div>

      {items.length === 0 ? (
        <p className="mt-2 text-sm text-plum-soft">No portfolio files yet.</p>
      ) : (
        <ul className="mt-2 grid gap-3">
          {items.map((item: LocalItem) => {
            const working = busy.kind === "working" && busy.id === item.id;
            return (
              <li key={item.id} className="rounded-2xl border border-line bg-cream p-4">
                <div className="flex items-start gap-3">
                  <span aria-hidden="true" className="grid h-12 w-10 shrink-0 place-items-center rounded-lg bg-peach-wash text-[11px] font-extrabold text-plum">PDF</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-plum-deep">{item.title}</p>
                    {item.description && <p className="text-sm text-plum-soft">{item.description}</p>}
                    <p className="text-xs text-plum-soft">{formatBytes(item.sizeBytes)}{item.status !== "ready" ? ". Checking file…" : ""}</p>
                  </div>
                  {item.localUrl && <a href={item.localUrl} target="_blank" rel="noopener noreferrer" className="shrink-0 text-sm font-semibold text-plum underline underline-offset-4">Preview</a>}
                </div>
                <div className="mt-3 grid gap-2 sm:grid-cols-[220px_1fr] sm:items-center">
                  <label className="sr-only" htmlFor={`vis-${item.id}`}>Who can see {item.title}</label>
                  <select id={`vis-${item.id}`} value={item.visibility} disabled={working} onChange={(e: ChangeEvent<HTMLSelectElement>) => void setVisibility(item, e.target.value as PortfolioVisibility)} className="h-10 rounded-full border border-line bg-paper px-3 text-sm text-plum-deep">
                    {VIS_ORDER.map((v) => <option key={v} value={v}>{VISIBILITY_LABEL[v]}</option>)}
                  </select>
                  <p className="text-xs text-plum-soft">{VISIBILITY_HELP[item.visibility]}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.shareUrl ? (
                    <>
                      <button type="button" onClick={() => void copy(item.id, item.shareUrl!)} className="h-9 rounded-full bg-plum px-4 text-sm font-semibold text-cream">{copied === item.id ? "Link copied" : "Copy share link"}</button>
                      <button type="button" disabled={working} onClick={() => void unshare(item)} className="h-9 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-plum">Turn off link</button>
                    </>
                  ) : (
                    <button type="button" disabled={working || item.status !== "ready"} onClick={() => void share(item)} className="h-9 rounded-full border border-line bg-paper px-4 text-sm font-semibold text-plum disabled:opacity-50">Create share link</button>
                  )}
                  <button type="button" disabled={working} onClick={() => void remove(item)} className="h-9 rounded-full px-3 text-sm font-semibold text-plum-soft underline underline-offset-4">Delete</button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
