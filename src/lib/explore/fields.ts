import type { FieldId } from "@/types/domain";

export interface Field {
  id: FieldId;
  name: string;
  roles: string;
  color: string;
  /** Single SVG path (24x24, stroke icon). */
  icon: string;
}

export const FIELDS: Field[] = [
  { id: "health", name: "Healthcare & Nursing", roles: "RN, nurse practitioner, physical therapist", color: "#F2A889", icon: "M12 5v14M5 12h14" },
  { id: "stem", name: "STEM & Tech", roles: "Software, data, cybersecurity, engineering", color: "#8E7AAB", icon: "M8 8l-4 4 4 4M16 8l4 4-4 4M13 6l-2 12" },
  { id: "mba", name: "MBA & Strategy", roles: "Strategy, product, general management", color: "#C6A15B", icon: "M4 19h16M6 16l4-5 3 3 5-7" },
  { id: "acct", name: "Accounting", roles: "Staff accountant, tax, audit, CPA", color: "#747A4C", icon: "M6 4h12v16H6zM9 8h6M9 12h6M9 16h3" },
  { id: "fin", name: "Finance", roles: "Financial analyst, risk, banking", color: "#49355F", icon: "M4 20V10M10 20V4M16 20v-8M22 20H2" },
  { id: "biz", name: "Business", roles: "Operations, business development, sales", color: "#E0876A", icon: "M4 8h16v11H4zM9 8V5h6v3" },
  { id: "hr", name: "HR", roles: "HR generalist, business partner, benefits", color: "#8E7AAB", icon: "M12 11a3 3 0 100-6 3 3 0 000 6zM5 20c0-4 3-6 7-6s7 2 7 6" },
  { id: "rec", name: "Recruiting", roles: "Technical, healthcare and campus recruiting", color: "#C6A15B", icon: "M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5" },
  { id: "hosp", name: "Hospitality", roles: "Hotel management, events, guest operations", color: "#747A4C", icon: "M3 18h18M5 18a7 7 0 0114 0M12 8V6" },
  { id: "cons", name: "Construction", roles: "Project management, superintendent, estimating", color: "#49355F", icon: "M3 20h18M5 20V10l7-5 7 5v10M10 20v-5h4v5" },
  { id: "design", name: "Design", roles: "Architecture, interior, UX and product", color: "#E0876A", icon: "M4 20l4-1 11-11-3-3L5 16zM14 6l3 3" },
  { id: "fashion", name: "Fashion", roles: "Buying, merchandising, product development", color: "#8E7AAB", icon: "M9 4l3 2 3-2 5 3-2 4-2-1v10H8V10l-2 1-2-4z" },
];

export const FIELD_BY_ID: Record<FieldId, Field> = Object.fromEntries(FIELDS.map((f) => [f.id, f])) as Record<FieldId, Field>;

export function isFieldId(v: string | null | undefined): v is FieldId {
  return !!v && v in FIELD_BY_ID;
}
