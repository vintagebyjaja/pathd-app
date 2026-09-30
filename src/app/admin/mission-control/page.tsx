import { getViewer, rerouteDestination } from "@/lib/admin/staff";
import { Reroute } from "@/components/admin/Reroute";
import { CHECKS, PHASES, SERVICES, SNAPSHOT_DATE, STEPS, percent, type CheckStatus, type FeatureStatus, type ServiceStatus } from "@/lib/admin/staff";
import { StepChecklist } from "@/components/admin/Reroute";

export const metadata = { title: "Mission Control" };

const TONE: Record<FeatureStatus | CheckStatus | ServiceStatus, [string, string]> = {
  done: ["bg-olive-wash text-olive-ink", "Done"],
  partial: ["bg-gold-wash text-gold-ink", "Partly done"],
  design: ["bg-lavender-wash text-plum", "Designed"],
  todo: ["bg-cream text-plum-soft", "Not started"],
  pass: ["bg-olive-wash text-olive-ink", "Passing"],
  unverified: ["bg-gold-wash text-gold-ink", "Not verified"],
  live: ["bg-olive-wash text-olive-ink", "Live"],
  off: ["bg-cream text-plum-soft", "Not connected"],
  blocked: ["bg-peach-wash text-plum", "Blocked"],
};

function Pill({ s }: { s: keyof typeof TONE }) {
  const [cls, label] = TONE[s];
  return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{label}</span>;
}

export default async function MissionControlPage() {
  // Every staff page gates itself. Non-staff get only the reroute screen:
  // none of the data below is rendered or sent to their browser.
  const viewer = await getViewer();
  if (!viewer.staff) {
    const to = rerouteDestination(viewer);
    return <Reroute href={to.href} label={to.label} />;
  }
  const overall = percent(PHASES.flatMap((p) => p.items));

  return (
    <div className="grid gap-10">
      <div>
        <h1 className="font-display text-4xl text-plum">Mission Control</h1>
        <p className="mt-2 text-plum-soft">Build progress and health. Visible only to founders and the PATHD Team. Snapshot as of {SNAPSHOT_DATE}.</p>
        <p className="mt-4 font-display text-5xl text-plum">{overall}%<span className="ml-2 font-sans text-base text-plum-soft">overall</span></p>
      </div>

      <section aria-labelledby="progress" className="grid gap-4">
        <h2 id="progress" className="font-display text-2xl text-plum">Progress by phase</h2>
        {PHASES.map((p) => {
          const v = percent(p.items);
          return (
            <details key={p.n} className="rounded-[var(--radius-card)] border border-line bg-paper p-5" open={p.n === 1}>
              <summary className="flex cursor-pointer items-center gap-4">
                <span className="font-semibold text-plum-deep">Phase {p.n}: {p.name}</span>
                <span className="ml-auto text-sm text-plum-soft">{v}%</span>
                <span className="h-2 w-32 overflow-hidden rounded-full bg-line" aria-hidden="true"><span className="block h-full bg-plum" style={{ width: `${v}%` }} /></span>
              </summary>
              <ul className="mt-4 grid">
                {p.items.map(([name, s, note]) => (
                  <li key={name} className="flex items-start gap-3 border-t border-line py-2.5 text-sm">
                    <span className="grid"><span className="font-semibold text-plum-deep">{name}</span>{note && <span className="text-plum-soft">{note}</span>}</span>
                    <span className="ml-auto"><Pill s={s} /></span>
                  </li>
                ))}
              </ul>
            </details>
          );
        })}
      </section>

      <div className="grid gap-5 md:grid-cols-2">
        <section aria-labelledby="health" className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
          <h2 id="health" className="font-display text-2xl text-plum">Health</h2>
          <ul className="mt-3 grid">
            {CHECKS.map(([name, s, note]) => (
              <li key={name} className="flex items-start gap-3 border-t border-line py-2.5 text-sm first:border-t-0">
                <span className="grid"><span className="font-semibold text-plum-deep">{name}</span>{note && <span className="text-plum-soft">{note}</span>}</span>
                <span className="ml-auto"><Pill s={s} /></span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="services" className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
          <h2 id="services" className="font-display text-2xl text-plum">Services</h2>
          <ul className="mt-3 grid">
            {SERVICES.map(([name, s, note]) => (
              <li key={name} className="flex items-start gap-3 border-t border-line py-2.5 text-sm first:border-t-0">
                <span className="grid"><span className="font-semibold text-plum-deep">{name}</span>{note && <span className="text-plum-soft">{note}</span>}</span>
                <span className="ml-auto"><Pill s={s} /></span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section aria-labelledby="next" className="rounded-[var(--radius-card)] border border-line bg-paper p-5">
        <h2 id="next" className="font-display text-2xl text-plum">Next steps</h2>
        <div className="mt-3"><StepChecklist steps={STEPS} /></div>
      </section>
    </div>
  );
}
