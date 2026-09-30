import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { PORTFOLIO_BUCKET } from "@/lib/portfolio/types";
import { PORTFOLIO_SELECT, jsonError, memberClient, toView, type PortfolioRow } from "@/lib/portfolio/server";

const Patch = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  visibility: z.enum(["private", "link", "connections", "employers"]).optional(),
});

/** Rename, describe, or change who can see a portfolio item. Owner only (RLS). */
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const m = await memberClient();
  if ("error" in m) return m.error;
  const { id } = await params;
  const parsed = Patch.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError("Invalid changes.", 400);

  const { data, error } = await m.sb.from("portfolio_items").update(parsed.data).eq("id", id).select(PORTFOLIO_SELECT).maybeSingle();
  if (error || !data) return jsonError("Couldn't save that change.", error ? 500 : 404);

  // Making an item private also turns off its share links.
  if (parsed.data.visibility === "private") {
    await m.sb.from("portfolio_share_links").update({ revoked_at: new Date().toISOString() }).eq("item_id", id).is("revoked_at", null);
    return NextResponse.json({ item: { ...toView(data as unknown as PortfolioRow), shareUrl: null } });
  }
  return NextResponse.json({ item: toView(data as unknown as PortfolioRow) });
}

/** Delete the file and its record. Share links go with it. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const m = await memberClient();
  if ("error" in m) return m.error;
  const { id } = await params;
  const { data: row } = await m.sb.from("portfolio_items").select("storage_path").eq("id", id).maybeSingle();
  if (!row) return jsonError("Portfolio item not found.", 404);
  await m.sb.storage.from(PORTFOLIO_BUCKET).remove([row.storage_path]);
  const { error } = await m.sb.from("portfolio_items").delete().eq("id", id);
  if (error) return jsonError("Couldn't delete that file.", 500);
  return NextResponse.json({ ok: true });
}
