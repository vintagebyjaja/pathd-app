import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { PORTFOLIO_BUCKET, PORTFOLIO_MAX_BYTES } from "@/lib/portfolio/types";
import { jsonError, memberClient } from "@/lib/portfolio/server";
import { rateLimit } from "@/lib/rate-limit";

const Body = z.object({
  title: z.string().trim().min(1, "Add a title.").max(120),
  description: z.string().trim().max(500).optional(),
  fileName: z.string().max(255),
  size: z.number().int().positive(),
  type: z.string(),
});

/**
 * Step 1 of an upload. Checks the file details, creates a pending portfolio
 * item, and returns a one-time signed URL so the browser can upload the PDF
 * straight to storage (large files can't pass through a serverless function).
 */
export async function POST(req: NextRequest) {
  const m = await memberClient();
  if ("error" in m) return m.error;
  if (!rateLimit(`portfolio-upload:${m.userId}`, 20, 60 * 60 * 1000)) return jsonError("Too many uploads. Try again later.", 429);

  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return jsonError(parsed.error.issues[0]?.message ?? "Invalid upload details.", 400);
  const b = parsed.data;
  if (b.type !== "application/pdf" || !b.fileName.toLowerCase().endsWith(".pdf")) return jsonError("Portfolios must be PDF files.", 415);
  if (b.size > PORTFOLIO_MAX_BYTES) return jsonError("Portfolios can be up to 25 MB.", 413);

  const path = `${m.userId}/${crypto.randomUUID()}.pdf`;
  const { data: item, error } = await m.sb
    .from("portfolio_items")
    .insert({ profile_id: m.userId, title: b.title, description: b.description || null, storage_path: path, size_bytes: b.size })
    .select("id")
    .single();
  if (error || !item) {
    const limit = error?.message?.includes("portfolio limit");
    return jsonError(limit ? "You can keep up to 10 portfolio files. Delete one to add another." : "Couldn't start the upload.", limit ? 409 : 500);
  }

  const { data: signed, error: signErr } = await m.sb.storage.from(PORTFOLIO_BUCKET).createSignedUploadUrl(path);
  if (signErr || !signed) {
    await m.sb.from("portfolio_items").delete().eq("id", item.id);
    return jsonError("Couldn't start the upload.", 500);
  }
  return NextResponse.json({ id: item.id, path: signed.path, token: signed.token });
}
