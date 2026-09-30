import { z } from "zod";

/**
 * Provider-agnostic AI interface. Business logic depends on this, never on a
 * vendor SDK. Adapters live beside this file (anthropic.ts, ...).
 */

export const ParsedResumeSchema = z.object({
  fullName: z.string().nullable(),
  headline: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
  workExperience: z.array(
    z.object({
      title: z.string(),
      company: z.string(),
      startDate: z.string().nullable(),
      endDate: z.string().nullable(),
      current: z.boolean(),
      summary: z.string().nullable(),
    }),
  ),
  education: z.array(
    z.object({
      school: z.string(),
      degree: z.string().nullable(),
      field: z.string().nullable(),
      graduationYear: z.string().nullable(),
    }),
  ),
  skills: z.array(z.string()),
  certifications: z.array(z.string()),
  licenses: z.array(z.string()),
  portfolioLinks: z.array(z.string()),
});

export type ParsedResume = z.infer<typeof ParsedResumeSchema>;

export const EMPTY_PARSED_RESUME: ParsedResume = {
  fullName: null,
  headline: null,
  location: null,
  email: null,
  workExperience: [],
  education: [],
  skills: [],
  certifications: [],
  licenses: [],
  portfolioLinks: [],
};

export interface AIProvider {
  readonly name: string;
  /** Extract structured fields. Output is a draft the user must review. */
  parseResume(resumeText: string): Promise<ParsedResume>;
}

export class AINotConfiguredError extends Error {
  constructor() {
    super("No AI provider is configured. Resume fields can be entered manually.");
  }
}
