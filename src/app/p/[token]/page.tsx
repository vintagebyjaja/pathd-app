import type { Metadata } from "next";
import Link from "next/link";
import { PathdWordmark } from "@/components/brand/Logo";
import { isSupabaseConfigured } from "@/lib/env";
import { PORTFOLIO_BUCKET, formatBytes } from "@/lib/portfolio/types";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Shared portfolio", robots: { index: false, follow: false, nocache: true } };

interface Shared {
  title: string;
  description: string | null;
  sizeBytes: number;
  ownerName: string;
  ownerHeadline: string | null;
  fileUrl: string;
}

async function loadShared(token: string): Promise<Shared | null> {
  if (!isSupabaseConfigured || !/^[A-Za-z0-9_-]{32,64}$/.test(token)) return null;
  const { createSupabaseAdminClient } = await import("@/lib/supabase/server");
  const admin = createSupabaseAdminClient();
  const { data: link } = await admin
    .from("portfolio_share_links")
    .select("id, view_count, expires_at, revoked_at, portfolio_items(title, description, size_bytes, status, visibility, storage_path, profiles(full_name, headline))")
    .eq("token", token)
    .maybeSingle();
  if (!link || link.revoked_at || (link.expires_at && new Date(link.expires_at).getTime() < Date.now())) return null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const item = (link as any).portfolio_items;
  if (!item || item.status !== "ready" || item.visibility === "private") return null;

  const { data: signed } = await admin.storage.from(PORTFOLIO_BUCKET).createSignedUrl(item.storage_path, 60 * 60);
  if (!signed) return null;
  await admin.from("portfolio_share_links").update({ view_count: (link.view_count ?? 0) + 1 }).eq("id", link.id);

  return {
    title: item.title,
    description: item.description,
    sizeBytes: item.size_bytes,
    ownerName: item.profiles?.full_name || "A PATHD member",
    ownerHeadline: item.profiles?.headline ?? null,
    fileUrl: signed.signedUrl,
  };
}

/** Public viewer for a portfolio shared by private link. Never indexed. */
export default async function SharedPortfolioPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const shared = await loadShared(token);

  return (
    <div className="min-h-dvh bg-cream">
      <header className="border-b border-line" style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/" aria-label="PATHD home"><PathdWordmark /></Link>
          <Link href="/sign-up" className="rounded-full bg-peach px-4 py-2 text-sm font-semibold text-plum-deep">Join PATHD</Link>
        </div>
      </header>
      <main id="main" className="mx-auto max-w-5xl px-5 py-8">
        {shared ? (
          <>
            <p className="text-sm font-semibold text-plum-soft">Portfolio shared by</p>
            <h1 className="font-display text-3xl text-plum md:text-4xl">{shared.ownerName}</h1>
            {shared.ownerHeadline && <p className="text-plum-soft">{shared.ownerHeadline}</p>}
            <div className="mt-6 rounded-[var(--radius-card)] border border-line bg-paper p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-plum-deep">{shared.title}</h2>
                  {shared.description && <p className="mt-1 max-w-2xl text-plum-soft">{shared.description}</p>}
                  <p className="mt-1 text-sm text-plum-soft">PDF, {formatBytes(shared.sizeBytes)}</p>
                </div>
                <a href={shared.fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex h-11 items-center rounded-full bg-plum px-5 font-semibold text-cream">Open PDF</a>
              </div>
              <iframe src={shared.fileUrl} title={`${shared.title} (PDF)`} className="mt-5 h-[75vh] w-full rounded-2xl border border-line bg-cream" />
              <p className="mt-3 text-xs text-plum-soft">If the preview doesn&apos;t load on your device, use Open PDF. This link was shared privately; please don&apos;t repost it.</p>
            </div>
          </>
        ) : (
          <div className="mx-auto max-w-md py-16 text-center">
            <h1 className="font-display text-4xl text-plum">This path is closed</h1>
            <p className="mt-3 text-plum-soft">The link may have been turned off by its owner, or it has expired. Ask them to share a new one.</p>
            <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-full bg-peach px-6 font-semibold text-plum-deep">Go to PATHD</Link>
          </div>
        )}
      </main>
    </div>
  );
}
