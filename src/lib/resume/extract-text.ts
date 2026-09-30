import "server-only";

export const MAX_RESUME_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_RESUME_TYPES = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
} as const;

export type ResumeKind = (typeof ACCEPTED_RESUME_TYPES)[keyof typeof ACCEPTED_RESUME_TYPES];

/** Checks magic bytes so a renamed file can't slip past the MIME check. */
export function sniffKind(buf: Buffer): ResumeKind | null {
  if (buf.subarray(0, 5).toString("latin1") === "%PDF-") return "pdf";
  if (buf[0] === 0x50 && buf[1] === 0x4b) return "docx"; // ZIP container
  return null;
}

export async function extractResumeText(buf: Buffer, kind: ResumeKind): Promise<string> {
  if (kind === "pdf") {
    const pdf = (await import("pdf-parse")).default;
    const out = await pdf(buf);
    return out.text;
  }
  const mammoth = await import("mammoth");
  const out = await mammoth.extractRawText({ buffer: buf });
  return out.value;
}
