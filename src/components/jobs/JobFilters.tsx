import { buttonClasses } from "@/components/ui/Button";

const INDUSTRIES = ["Healthcare", "Technology", "Business Strategy", "Accounting", "Finance", "Business", "Human Resources", "Recruiting", "Hospitality", "Construction", "Design", "Fashion"];

export interface FilterValues {
  q?: string;
  minSalary?: string;
  maxMiles?: string;
  work?: string[];
  industry?: string;
  hideNoPay?: string;
  sort?: string;
}

/**
 * Server-rendered GET form: filters live in the URL, so results are
 * shareable, back-button friendly and work without JavaScript.
 */
export function JobFilters({ values }: { values: FilterValues }) {
  const work = new Set(values.work ?? []);
  const field = "h-11 w-full rounded-xl border border-line bg-paper px-3 text-[15px] text-plum-deep";
  return (
    <form method="get" action="/jobs" className="grid gap-4 rounded-[var(--radius-card)] border border-line bg-paper p-5" aria-label="Job filters">
      <div>
        <label htmlFor="q" className="text-sm font-semibold text-plum">Role, skill or company</label>
        <input id="q" name="q" defaultValue={values.q} placeholder="Project designer, Revit…" className={`${field} mt-1.5`} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="minSalary" className="text-sm font-semibold text-plum">Minimum pay</label>
          <select id="minSalary" name="minSalary" defaultValue={values.minSalary ?? ""} className={`${field} mt-1.5`}>
            <option value="">Any</option>
            {[50, 70, 85, 100, 120].map((k) => (
              <option key={k} value={k * 1000}>${k}K+</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="maxMiles" className="text-sm font-semibold text-plum">Distance</label>
          <select id="maxMiles" name="maxMiles" defaultValue={values.maxMiles ?? ""} className={`${field} mt-1.5`}>
            <option value="">Any</option>
            {[5, 10, 15, 25, 50].map((m) => (
              <option key={m} value={m}>Within {m} mi</option>
            ))}
          </select>
        </div>
      </div>
      <fieldset>
        <legend className="text-sm font-semibold text-plum">Work style</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["remote", "hybrid", "onsite"] as const).map((w) => (
            <label key={w} className="cursor-pointer">
              <input type="checkbox" name="work" value={w} defaultChecked={work.has(w)} className="peer sr-only" />
              <span className="inline-block rounded-full border border-line px-3.5 py-1.5 text-sm text-plum peer-checked:border-plum peer-checked:bg-plum peer-checked:text-cream peer-focus-visible:outline-3 peer-focus-visible:outline-plum">
                {w === "onsite" ? "In person" : w[0]!.toUpperCase() + w.slice(1)}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <div>
        <label htmlFor="industry" className="text-sm font-semibold text-plum">Industry</label>
        <select id="industry" name="industry" defaultValue={values.industry ?? ""} className={`${field} mt-1.5`}>
          <option value="">All industries</option>
          {INDUSTRIES.map((i) => (
            <option key={i}>{i}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="sort" className="text-sm font-semibold text-plum">Sort by</label>
        <select id="sort" name="sort" defaultValue={values.sort ?? "match"} className={`${field} mt-1.5`}>
          <option value="match">Best match</option>
          <option value="pay">Highest pay</option>
          <option value="recent">Most recent</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm text-plum">
        <input type="checkbox" name="hideNoPay" value="1" defaultChecked={values.hideNoPay === "1"} className="h-4 w-4 accent-plum" />
        Only show jobs that share pay
      </label>
      <button type="submit" className={buttonClasses("primary", "md", "w-full")}>Show jobs</button>
    </form>
  );
}
