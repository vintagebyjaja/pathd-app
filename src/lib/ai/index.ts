import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { AINotConfiguredError, ParsedResumeSchema, type AIProvider, type ParsedResume } from "./provider";

const RESUME_SYSTEM = `You extract structured data from resumes for a career platform.
Rules:
- Only include information literally present in the resume. Never infer or invent.
- Use null for missing single values and [] for missing lists.
- Do not infer or output age, race, religion, sex, disability, or other protected traits.
- Respond with a single JSON object and nothing else, matching this shape:
{"fullName":string|null,"headline":string|null,"location":string|null,"email":string|null,
"workExperience":[{"title":string,"company":string,"startDate":string|null,"endDate":string|null,"current":boolean,"summary":string|null}],
"education":[{"school":string,"degree":string|null,"field":string|null,"graduationYear":string|null}],
"skills":string[],"certifications":string[],"licenses":string[],"portfolioLinks":string[]}`;

export class AnthropicProvider implements AIProvider {
  readonly name = "anthropic";
  private client: Anthropic;
  private model: string;

  constructor(apiKey: string, model: string) {
    this.client = new Anthropic({ apiKey });
    this.model = model;
  }

  async parseResume(resumeText: string): Promise<ParsedResume> {
    const msg = await this.client.messages.create({
      model: this.model,
      max_tokens: 4000,
      system: RESUME_SYSTEM,
      messages: [{ role: "user", content: `<resume>\n${resumeText.slice(0, 60_000)}\n</resume>` }],
    });
    const text = msg.content.map((b) => (b.type === "text" ? b.text : "")).join("");
    const json = text.replace(/```json|```/g, "").trim();
    return ParsedResumeSchema.parse(JSON.parse(json));
  }
}

let cached: AIProvider | null | undefined;

/** Returns the configured provider, or null when AI is not configured. */
export function getAIProvider(): AIProvider | null {
  if (cached !== undefined) return cached;
  const which = process.env.AI_PROVIDER ?? "anthropic";
  if (which === "anthropic" && process.env.ANTHROPIC_API_KEY) {
    cached = new AnthropicProvider(process.env.ANTHROPIC_API_KEY, process.env.ANTHROPIC_MODEL ?? "claude-sonnet-5");
  } else {
    cached = null;
  }
  return cached;
}

export function requireAIProvider(): AIProvider {
  const p = getAIProvider();
  if (!p) throw new AINotConfiguredError();
  return p;
}
