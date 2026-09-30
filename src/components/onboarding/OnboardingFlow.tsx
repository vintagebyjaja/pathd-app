"use client";

import { EMPTY_PARSED_RESUME, type ParsedResume } from "@/lib/ai/provider";
import type { CareerPreferences, PrivacySettings, Purpose, Visibility, WorkType } from "@/types/domain";
import { useId, useRef, useState, useTransition } from "react";
import { cn } from "@/lib/env";
import { Button } from "@/components/ui/Button";
import { saveOnboarding } from "@/app/onboarding/actions";

export interface OnboardingDraft {
  purposes: Purpose[];
  resume: ParsedResume;
  preferences: Omit<CareerPreferences, "searchCenter"> & { preferredLocations: string[] };
  privacy: PrivacySettings;
}

export const PURPOSES: { id: Purpose; label: string; tone: "peach" | "lavender" | "olive" | "plum" }[] = [
  { id: "find_job", label: "Find a job", tone: "peach" },
  { id: "advance_career", label: "Advance my career", tone: "peach" },
  { id: "explore_careers", label: "Explore careers", tone: "plum" },
  { id: "build_network", label: "Build my network", tone: "lavender" },
  { id: "pursue_licensure", label: "Pursue licensure", tone: "lavender" },
  { id: "find_study_group", label: "Find a study group", tone: "lavender" },
  { id: "connect_major", label: "Connect with my major", tone: "lavender" },
  { id: "find_wellness", label: "Find wellness or activity groups", tone: "olive" },
  { id: "hire_talent", label: "Hire talent", tone: "plum" },
];

export const DEFAULT_PRIVACY: PrivacySettings = {
  profile: "public",
  currentEmployer: "connections",
  jobSeekingStatus: "private",
  locationPrecision: "city",
  circles: "connections",
  connections: "connections",
  activity: "connections",
};

export const inputCls = "mt-1.5 h-11 w-full rounded-xl border border-line bg-paper px-3 text-[15px] text-plum-deep";

export function TextField({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-plum">{label}</label>
      <input id={id} type={type} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    </div>
  );
}

/** Comma-separated list editor, e.g. skills. */
export function ListField({ label, hint, value, onChange }: { label: string; hint?: string; value: string[]; onChange: (v: string[]) => void }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-sm font-semibold text-plum">{label}</label>
      {hint && <p id={`${id}-hint`} className="text-xs text-plum-soft">{hint}</p>}
      <input
        id={id}
        aria-describedby={hint ? `${id}-hint` : undefined}
        defaultValue={value.join(", ")}
        onBlur={(e) => onChange(e.target.value.split(",").map((s) => s.trim()).filter(Boolean))}
        className={inputCls}
      />
    </div>
  );
}

const TONE = {
  peach: "peer-checked:bg-peach peer-checked:border-peach",
  lavender: "peer-checked:bg-lavender peer-checked:border-lavender",
  olive: "peer-checked:bg-olive peer-checked:border-olive peer-checked:text-cream",
  plum: "peer-checked:bg-plum peer-checked:border-plum peer-checked:text-cream",
} as const;

export function PurposeStep({ value, onChange }: { value: Purpose[]; onChange: (v: Purpose[]) => void }) {
  const toggle = (p: Purpose) => onChange(value.includes(p) ? value.filter((x) => x !== p) : [...value, p]);
  return (
    <fieldset>
      <legend className="font-display text-3xl text-plum">What brings you to PATHD?</legend>
      <p className="mt-2 text-plum-soft">Choose all that apply. You can change this anytime.</p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        {PURPOSES.map((p) => (
          <label key={p.id} className="cursor-pointer">
            <input type="checkbox" className="peer sr-only" checked={value.includes(p.id)} onChange={() => toggle(p.id)} />
            <span
              className={cn(
                "inline-block rounded-full border border-line bg-paper px-4 py-2.5 text-[15px] text-plum-deep transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-plum",
                TONE[p.tone],
              )}
            >
              {p.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

type Status = { kind: "idle" } | { kind: "uploading" } | { kind: "error"; message: string } | { kind: "done"; note: string };

export function ResumeStep({ onParsed, onSkip }: { onParsed: (r: ParsedResume) => void; onSkip: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function upload(file: File) {
    setStatus({ kind: "uploading" });
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/resume/parse", { method: "POST", body });
      const json = await res.json();
      if (!res.ok) return setStatus({ kind: "error", message: json.error ?? "Upload failed." });
      onParsed(json.parsed);
      setStatus({
        kind: "done",
        note: json.aiAvailable
          ? "We filled in what we found. Check every field on the next step."
          : json.warning ?? "Your file is uploaded. Automatic reading isn't set up yet, so add your details on the next step.",
      });
    } catch {
      setStatus({ kind: "error", message: "Couldn't reach PATHD. Check your connection and try again." });
    }
  }

  return (
    <div>
      <h2 className="font-display text-3xl text-plum">Add your resume</h2>
      <p className="mt-2 text-plum-soft">PDF or Word (.docx), up to 5 MB. Your resume stays private unless you choose to share it.</p>

      <div
        className="mt-6 grid place-items-center rounded-[var(--radius-card)] border-2 border-dashed border-line bg-paper px-6 py-12 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const f = e.dataTransfer.files[0];
          if (f) upload(f);
        }}
      >
        <p className="font-semibold text-plum-deep">Drop your resume here</p>
        <p className="mt-1 text-sm text-plum-soft">or</p>
        <input
          ref={input}
          type="file"
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="sr-only"
          id="resume-file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
        />
        <Button type="button" variant="primary" className="mt-3" onClick={() => input.current?.click()} disabled={status.kind === "uploading"}>
          {status.kind === "uploading" ? "Reading your resume…" : "Choose a file"}
        </Button>
      </div>

      <div aria-live="polite" className="mt-4 min-h-6 text-sm">
        {status.kind === "error" && <p className="text-[#9b2c2c]">{status.message}</p>}
        {status.kind === "done" && <p className="text-olive-ink">{status.note}</p>}
      </div>

      <button type="button" onClick={onSkip} className="mt-2 text-sm font-semibold text-plum underline underline-offset-4">
        Skip and enter details myself
      </button>
    </div>
  );
}

type Work = ParsedResume["workExperience"][number];
type Edu = ParsedResume["education"][number];

const blankWork: Work = { title: "", company: "", startDate: null, endDate: null, current: false, summary: null };
const blankEdu: Edu = { school: "", degree: null, field: null, graduationYear: null };

export function ReviewStep({ value, onChange }: { value: ParsedResume; onChange: (v: ParsedResume) => void }) {
  const set = <K extends keyof ParsedResume>(k: K, v: ParsedResume[K]) => onChange({ ...value, [k]: v });
  const setWork = (i: number, patch: Partial<Work>) => set("workExperience", value.workExperience.map((w, j) => (j === i ? { ...w, ...patch } : w)));
  const setEdu = (i: number, patch: Partial<Edu>) => set("education", value.education.map((e, j) => (j === i ? { ...e, ...patch } : e)));

  return (
    <div className="grid gap-8">
      <div>
        <h2 className="font-display text-3xl text-plum">Check your details</h2>
        <p className="mt-2 text-plum-soft">Anything we read from your resume is a draft. Fix what&apos;s wrong and add what&apos;s missing.</p>
      </div>

      <section className="grid gap-4" aria-labelledby="basics">
        <h3 id="basics" className="font-semibold text-plum-deep">Basics</h3>
        <TextField label="Full name" value={value.fullName ?? ""} onChange={(v) => set("fullName", v)} />
        <TextField label="Headline" value={value.headline ?? ""} onChange={(v) => set("headline", v)} placeholder="Architectural Designer focused on higher-ed work" />
        <TextField label="City" value={value.location ?? ""} onChange={(v) => set("location", v)} placeholder="Charlotte, NC" />
      </section>

      <section className="grid gap-4" aria-labelledby="work">
        <h3 id="work" className="font-semibold text-plum-deep">Work history</h3>
        {value.workExperience.map((w, i) => (
          <div key={i} className="grid gap-3 rounded-2xl border border-line bg-paper p-4">
            <TextField label="Title" value={w.title} onChange={(v) => setWork(i, { title: v })} />
            <TextField label="Company" value={w.company} onChange={(v) => setWork(i, { company: v })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Start" value={w.startDate ?? ""} onChange={(v) => setWork(i, { startDate: v || null })} placeholder="2021-06" />
              <TextField label="End" value={w.endDate ?? ""} onChange={(v) => setWork(i, { endDate: v || null })} placeholder={w.current ? "Present" : "2024-01"} />
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-plum">
                <input type="checkbox" checked={w.current} onChange={(e) => setWork(i, { current: e.target.checked })} className="h-4 w-4 accent-plum" />
                I work here now
              </label>
              <button type="button" className="text-sm font-semibold text-plum underline underline-offset-4" onClick={() => set("workExperience", value.workExperience.filter((_, j) => j !== i))}>
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-semibold text-plum underline underline-offset-4" onClick={() => set("workExperience", [...value.workExperience, blankWork])}>
          Add a role
        </button>
      </section>

      <section className="grid gap-4" aria-labelledby="edu">
        <h3 id="edu" className="font-semibold text-plum-deep">Education</h3>
        {value.education.map((e, i) => (
          <div key={i} className="grid gap-3 rounded-2xl border border-line bg-paper p-4">
            <TextField label="School" value={e.school} onChange={(v) => setEdu(i, { school: v })} />
            <div className="grid grid-cols-2 gap-3">
              <TextField label="Degree" value={e.degree ?? ""} onChange={(v) => setEdu(i, { degree: v || null })} />
              <TextField label="Year" value={e.graduationYear ?? ""} onChange={(v) => setEdu(i, { graduationYear: v || null })} />
            </div>
            <TextField label="Field of study" value={e.field ?? ""} onChange={(v) => setEdu(i, { field: v || null })} />
            <button type="button" className="justify-self-end text-sm font-semibold text-plum underline underline-offset-4" onClick={() => set("education", value.education.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" className="justify-self-start text-sm font-semibold text-plum underline underline-offset-4" onClick={() => set("education", [...value.education, blankEdu])}>
          Add education
        </button>
      </section>

      <section className="grid gap-4" aria-labelledby="creds">
        <h3 id="creds" className="font-semibold text-plum-deep">Skills and credentials</h3>
        <ListField label="Skills" hint="Separate with commas" value={value.skills} onChange={(v) => set("skills", v)} />
        <ListField label="Certifications" hint="For example: LEED AP, PMP" value={value.certifications} onChange={(v) => set("certifications", v)} />
        <ListField label="Licenses" hint="Only licenses you currently hold" value={value.licenses} onChange={(v) => set("licenses", v)} />
      </section>
    </div>
  );
}

type Prefs = OnboardingDraft["preferences"];

export function PreferencesStep({ value, onChange }: { value: Prefs; onChange: (v: Prefs) => void }) {
  const set = <K extends keyof Prefs>(k: K, v: Prefs[K]) => onChange({ ...value, [k]: v });
  const toggleWork = (w: WorkType) => set("workTypes", value.workTypes.includes(w) ? value.workTypes.filter((x) => x !== w) : [...value.workTypes, w]);

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-display text-3xl text-plum">What are you looking for?</h2>
        <p className="mt-2 text-plum-soft">We use this to rank jobs and explain your matches.</p>
      </div>
      <ListField label="Roles you want" hint="Separate with commas" value={value.desiredRoles} onChange={(v) => set("desiredRoles", v)} />
      <div>
        <label htmlFor="salaryTarget" className="text-sm font-semibold text-plum">Minimum yearly pay for your next job</label>
        <p id="salaryTarget-hint" className="text-xs text-plum-soft">Only you see this. Employers only see whether you fit their posted range.</p>
        <input
          id="salaryTarget"
          inputMode="numeric"
          placeholder="85000"
          aria-describedby="salaryTarget-hint"
          defaultValue={value.salaryTarget ?? ""}
          onBlur={(e) => {
            const n = Number(e.target.value.replace(/[^0-9]/g, ""));
            set("salaryTarget", n > 0 ? n : null);
          }}
          className={inputCls}
        />
      </div>
      <ListField label="Industries" hint="Separate with commas" value={value.industries} onChange={(v) => set("industries", v)} />
      <fieldset>
        <legend className="text-sm font-semibold text-plum">Work style</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["remote", "hybrid", "onsite"] as const).map((w) => (
            <label key={w} className="cursor-pointer">
              <input type="checkbox" className="peer sr-only" checked={value.workTypes.includes(w)} onChange={() => toggleWork(w)} />
              <span className="inline-block rounded-full border border-line bg-paper px-4 py-2 text-sm text-plum peer-checked:border-plum peer-checked:bg-plum peer-checked:text-cream peer-focus-visible:outline-3 peer-focus-visible:outline-plum">
                {w === "onsite" ? "In person" : w[0]!.toUpperCase() + w.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="commute" className="text-sm font-semibold text-plum">Longest commute you&apos;d accept</label>
        <select id="commute" value={value.commuteMiles ?? ""} onChange={(e) => set("commuteMiles", e.target.value ? Number(e.target.value) : null)} className={inputCls}>
          <option value="">No preference</option>
          {[5, 10, 15, 25, 40].map((m) => (
            <option key={m} value={m}>{m} miles</option>
          ))}
        </select>
      </div>
      <ListField label="Preferred cities" hint="Separate with commas" value={value.preferredLocations} onChange={(v) => set("preferredLocations", v)} />
      <label className="flex items-center gap-2 text-sm text-plum">
        <input type="checkbox" checked={value.willingToRelocate} onChange={(e) => set("willingToRelocate", e.target.checked)} className="h-4 w-4 accent-plum" />
        I&apos;m open to relocating
      </label>
    </div>
  );
}

const ROWS: { key: Exclude<keyof PrivacySettings, "locationPrecision">; label: string }[] = [
  { key: "profile", label: "Your profile" },
  { key: "currentEmployer", label: "Current employer" },
  { key: "jobSeekingStatus", label: "That you're looking for work" },
  { key: "circles", label: "Circles you've joined" },
  { key: "connections", label: "Your connections" },
  { key: "activity", label: "Your activity" },
];

const VIS_LABEL: Record<Visibility, string> = { public: "Everyone", connections: "Connections", private: "Only me" };

export function PrivacyStep({ value, onChange }: { value: PrivacySettings; onChange: (v: PrivacySettings) => void }) {
  return (
    <div className="grid gap-6">
      <div>
        <h2 className="font-display text-3xl text-plum">Choose who sees what</h2>
        <p className="mt-2 text-plum-soft">Your exact location is never shown to anyone. You can change these in Settings anytime.</p>
        <p className="mt-3 rounded-xl bg-lavender-wash p-3 text-sm text-plum">
          Your pay is always private. PATHD never asks what you earn now, and your minimum pay is never shown to anyone,
          including employers. They only see whether you fit the range they posted.
        </p>
      </div>
      <div className="grid gap-4">
        {ROWS.map((r) => (
          <div key={r.key} className="grid grid-cols-[1fr_150px] items-center gap-3">
            <label htmlFor={`vis-${r.key}`} className="text-[15px] text-plum-deep">{r.label}</label>
            <select id={`vis-${r.key}`} value={value[r.key]} onChange={(e) => onChange({ ...value, [r.key]: e.target.value as Visibility })} className={`${inputCls} mt-0`}>
              {(Object.keys(VIS_LABEL) as Visibility[]).map((v) => (
                <option key={v} value={v}>{VIS_LABEL[v]}</option>
              ))}
            </select>
          </div>
        ))}
        <div className="grid grid-cols-[1fr_150px] items-center gap-3">
          <label htmlFor="vis-location" className="text-[15px] text-plum-deep">Location shown on your profile</label>
          <select
            id="vis-location"
            value={value.locationPrecision}
            onChange={(e) => onChange({ ...value, locationPrecision: e.target.value as PrivacySettings["locationPrecision"] })}
            className={`${inputCls} mt-0`}
          >
            <option value="city">City</option>
            <option value="region">State only</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>
      </div>
    </div>
  );
}

const STEPS = ["Purpose", "Resume", "Details", "Preferences", "Privacy"] as const;

export function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [saving, startSaving] = useTransition();
  const [draft, setDraft] = useState<OnboardingDraft>({
    purposes: [],
    resume: EMPTY_PARSED_RESUME,
    preferences: { desiredRoles: [], salaryTarget: null, industries: [], workTypes: [], commuteMiles: null, preferredLocations: [], willingToRelocate: false },
    privacy: DEFAULT_PRIVACY,
  });

  const canContinue = step !== 0 || draft.purposes.length > 0;
  const next = () => {
    setError(null);
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
    window.scrollTo({ top: 0 });
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const finish = () =>
    startSaving(async () => {
      const res = await saveOnboarding(draft);
      if (res?.error) setError(res.error);
    });

  return (
    <div className="mx-auto w-full max-w-xl">
      <nav aria-label="Setup progress" className="mb-10">
        <ol className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1">
              <span className={`block h-1.5 rounded-full ${i <= step ? "bg-plum" : "bg-line"}`} />
              <span className={`mt-2 hidden text-xs sm:block ${i === step ? "font-semibold text-plum" : "text-plum-soft"}`} aria-current={i === step ? "step" : undefined}>
                {s}
              </span>
            </li>
          ))}
        </ol>
        <p className="mt-2 text-xs text-plum-soft sm:hidden">
          Step {step + 1} of {STEPS.length}: {STEPS[step]}
        </p>
      </nav>

      {step === 0 && <PurposeStep value={draft.purposes} onChange={(purposes) => setDraft({ ...draft, purposes })} />}
      {step === 1 && (
        <ResumeStep
          onParsed={(resume) => setDraft((d) => ({ ...d, resume }))}
          onSkip={next}
        />
      )}
      {step === 2 && <ReviewStep value={draft.resume} onChange={(resume) => setDraft({ ...draft, resume })} />}
      {step === 3 && <PreferencesStep value={draft.preferences} onChange={(preferences) => setDraft({ ...draft, preferences })} />}
      {step === 4 && <PrivacyStep value={draft.privacy} onChange={(privacy) => setDraft({ ...draft, privacy })} />}

      <div aria-live="polite" className="mt-6 min-h-5 text-sm text-[#9b2c2c]">{error}</div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-6">
        <Button type="button" variant="ghost" onClick={back} disabled={step === 0}>Back</Button>
        {step < STEPS.length - 1 ? (
          <Button type="button" variant="primary" onClick={next} disabled={!canContinue}>Continue</Button>
        ) : (
          <Button type="button" variant="action" onClick={finish} disabled={saving}>{saving ? "Saving…" : "Build my PATHD profile"}</Button>
        )}
      </div>
    </div>
  );
}
