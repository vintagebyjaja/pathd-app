import { NextResponse, type NextRequest } from "next/server";
import { PORTFOLIO_BUCKET, PORTFOLIO_MAX_BYTES } from "@/lib/portfolio/types";
import { PORTFOLIO_SELECT, jsonError, memberClient, toView, type PortfolioRow } from "@/lib/portfolio/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";

/**
 * Step 2 of an upload. Confirms the stored file is really a PDF within 25 MB
 * (the bucket enforces type and size too), then marks the item ready.
 */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const m = await memberClient();
  if ("error" in m) return m.error;
  const { id } = await params;

  // Ownership check through row-level security.
  const { data: row } = await m.sb.from("portfolio_items").select("id, storage_path").eq("id", id).maybeSingle();
  if (!row) return jsonError("Portfolio item not found.", 404);

  const admin = createSupabaseAdminClient();
  const folder = row.storage_path.split("/")[0] ?? "";
  const name = row.storage_path.split("/")[1] ?? "";
  const { data: files } = await admin.storage.from(PORTFOLIO_BUCKET).list(folder, { search: name, limit: 1 });
  const meta = files?.find((f) => f.name === name);
  const size = Number((meta?.metadata as { size?: number } | undefined)?.size ?? 0);

  let isPdf = false;
  if (meta && size > 0 && size <= PORTFOLIO_MAX_BYTES) {
    const { data: signed } = await admin.storage.from(PORTFOLIO_BUCKET).createSignedUrl(row.storage_path, 60);
    if (signed) {
      const head = await fetch(signed.signedUrl, { headers: { Range: "bytes=0-4" } }).then((r) => r.arrayBuffer()).catch(() => null);
      isPdf = !!head && new TextDecoder().decode(new Uint8Array(head).slice(0, 5)) === "%PDF-";
    }
  }

  if (!isPdf) {
    await admin.storage.from(PORTFOLIO_BUCKET).remove([row.storage_path]);
    await admin.from("portfolio_items").delete().eq("id", id);
    return jsonError("That file isn't a valid PDF under 25 MB, so it wasn't saved.", 422);
  }

  const { data: updated, error } = await admin
    .from("portfolio_items")
    .update({ status: "ready", size_bytes: size })
    .eq("id", id)
    .select(PORTFOLIO_SELECT)
    .single();
  if (error || !updated) return jsonError("Couldn't finish the upload.", 500);
  return NextResponse.json({ item: toView(updated as unknown as PortfolioRow) });
}
