import { NextResponse, type NextRequest } from "next/server";
import { newShareToken } from "@/lib/portfolio/types";
import { jsonError, memberClient, shareUrlFor } from "@/lib/portfolio/server";

/** Create (or return the existing) private share link for a ready portfolio item. */
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const m = await memberClient();
  if ("error" in m) return m.error;
  const { id } = await params;

  const { data: item } = await m.sb.from("portfolio_items").select("id, status").eq("id", id).maybeSingle();
  if (!item) return jsonError("Portfolio item not found.", 404);
  if (item.status !== "ready") return jsonError("This file is still being checked.", 409);

  const { data: existing } = await m.sb
    .from("portfolio_share_links")
    .select("token")
    .eq("item_id", id)
    .is("revoked_at", null)
    .limit(1)
    .maybeSingle();
  let token = existing?.token as string | undefined;
  if (!token) {
    token = newShareToken();
    const { error } = await m.sb.from("portfolio_share_links").insert({ item_id: id, token });
    if (error) return jsonError("Couldn't create a share link.", 500);
  }
  await m.sb.from("portfolio_items").update({ visibility: "link" }).eq("id", id).eq("visibility", "private");
  return NextResponse.json({ shareUrl: shareUrlFor(token) });
}

/** Turn off every share link for this item. People with the old link lose access. */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const m = await memberClient();
  if ("error" in m) return m.error;
  const { id } = await params;
  const { error } = await m.sb.from("portfolio_share_links").update({ revoked_at: new Date().toISOString() }).eq("item_id", id).is("revoked_at", null);
  if (error) return jsonError("Couldn't turn off the link.", 500);
  return NextResponse.json({ ok: true });
}
