import { NextResponse, type NextRequest } from "next/server";
import { ACCEPTED_RESUME_TYPES, MAX_RESUME_BYTES, extractResumeText, sniffKind } from "@/lib/resume/extract-text";
import { getAIProvider } from "@/lib/ai";
import { EMPTY_PARSED_RESUME } from "@/lib/ai/provider";
import { isSupabaseConfigured } from "@/lib/env";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * Accepts a PDF/DOCX resume, extracts text, and (if configured) asks the AI
 * provider for a structured DRAFT. Nothing is saved to the profile here —
 * the user reviews and corrects every field first.
 */
export async function POST(req: NextRequest) {
  let userId: string | null = null;
  if (isSupabaseConfigured) {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const sb = await createSupabaseServerClient();
    const { data } = await sb.auth.getUser();
    if (!data.user) return NextResponse.json({ error: "Sign in to upload a resume." }, { status: 401 });
    userId = data.user.id;
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!rateLimit(`resume:${userId ?? ip}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many uploads. Try again in an hour." }, { status: 429 });
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Attach a PDF or Word (.docx) file." }, { status: 400 });
  if (file.size > MAX_RESUME_BYTES) return NextResponse.json({ error: "Resumes must be 5 MB or smaller." }, { status: 413 });
  if (!(file.type in ACCEPTED_RESUME_TYPES)) {
    return NextResponse.json({ error: "Upload a PDF or Word (.docx) file." }, { status: 415 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const kind = sniffKind(buf);
  if (!kind || kind !== ACCEPTED_RESUME_TYPES[file.type as keyof typeof ACCEPTED_RESUME_TYPES]) {
    return NextResponse.json({ error: "That file doesn't look like a valid PDF or .docx." }, { status: 415 });
  }

  let text: string;
  try {
    text = await extractResumeText(buf, kind);
  } catch {
    return NextResponse.json({ error: "We couldn't read text from that file. You can enter details manually." }, { status: 422 });
  }
  if (text.trim().length < 50) {
    return NextResponse.json({ error: "That file has little readable text (it may be a scanned image). You can enter details manually." }, { status: 422 });
  }

  if (isSupabaseConfigured && userId) {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const sb = await createSupabaseServerClient();
    const path = `${userId}/${crypto.randomUUID()}.${kind}`;
    // Private bucket; RLS restricts objects to the owner's folder.
    await sb.storage.from("resumes").upload(path, buf, { contentType: file.type, upsert: false });
  }

  const ai = getAIProvider();
  if (!ai) {
    return NextResponse.json({ parsed: EMPTY_PARSED_RESUME, aiAvailable: false });
  }
  try {
    const parsed = await ai.parseResume(text);
    return NextResponse.json({ parsed, aiAvailable: true });
  } catch {
    return NextResponse.json({ parsed: EMPTY_PARSED_RESUME, aiAvailable: false, warning: "Automatic reading failed. Enter your details below." });
  }
}
