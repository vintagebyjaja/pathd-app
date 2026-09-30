import type { SceneType } from "./samples";

/**
 * Illustrated workplace scenes shown on map previews until an employer or
 * business uploads real photos (never scraped). Output is a static SVG string
 * built only from values in this file, so it is safe to inline.
 */

function windows(x: number, y: number, cols: number, rows: number, w: number, h: number, gx: number, gy: number, c: string): string {
  let s = "";
  for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) s += `<rect x="${x + q * (w + gx)}" y="${y + r * (h + gy)}" width="${w}" height="${h}" rx="1.5" fill="${c}"/>`;
  return s;
}
const tree = (x: number, y: number, c = "#747A4C") => `<rect x="${x - 2}" y="${y}" width="4" height="14" fill="#5A4A3A"/><circle cx="${x}" cy="${y - 4}" r="11" fill="${c}"/>`;
const GROUND = '<rect x="0" y="104" width="320" height="26" fill="#D9CDB6"/><rect x="0" y="100" width="320" height="6" fill="#B9C08F"/>';
const stripes = (x0: number, n: number, step: number) => Array.from({ length: n }, (_, i) => `<rect x="${x0 + i * step}" y="36" width="${step / 2}" height="14" fill="#FFFBF4" opacity=".55"/>`).join("");

function body(type: SceneType, accent: string): string {
  switch (type) {
    case "hospital":
      return `<rect x="70" y="26" width="180" height="78" rx="3" fill="#FFFBF4"/><rect x="70" y="26" width="180" height="10" fill="${accent}"/>${windows(82, 44, 8, 3, 14, 10, 6, 8, "#C9D6E0")}<rect x="140" y="80" width="40" height="24" fill="#8FA7B8"/><rect x="146" y="10" width="28" height="28" rx="4" fill="#FFFBF4" stroke="${accent}" stroke-width="2"/><path d="M160 16v16M152 24h16" stroke="#E0876A" stroke-width="5" stroke-linecap="round"/>${tree(40, 86)}${tree(282, 86)}`;
    case "clinic":
      return `<rect x="80" y="50" width="160" height="54" rx="3" fill="#FFFBF4"/><path d="M74 50h172l-10-12H84z" fill="${accent}"/>${windows(92, 60, 6, 1, 18, 16, 8, 0, "#C9D6E0")}<rect x="146" y="80" width="28" height="24" fill="#8FA7B8"/><circle cx="210" cy="88" r="9" fill="#FFFBF4" stroke="#E0876A" stroke-width="2"/><path d="M210 83v10M205 88h10" stroke="#E0876A" stroke-width="3" stroke-linecap="round"/>${tree(50, 86)}${tree(270, 86, "#8C9463")}`;
    case "tower":
      return `<rect x="120" y="8" width="70" height="96" fill="#6D7F95"/><rect x="120" y="8" width="70" height="6" fill="${accent}"/>${windows(126, 20, 5, 8, 9, 6, 4, 4, "#B8CCDD")}<rect x="196" y="40" width="54" height="64" fill="#8C9BAE"/>${windows(202, 48, 4, 6, 8, 6, 4, 4, "#D2DEE8")}<rect x="70" y="54" width="44" height="50" fill="#A8B3C0"/>${windows(76, 62, 3, 4, 8, 6, 5, 5, "#E3EAF0")}${tree(40, 86)}${tree(280, 86)}`;
    case "lowoffice":
      return `<rect x="60" y="46" width="200" height="58" rx="2" fill="#E9E1D1"/><rect x="60" y="46" width="200" height="8" fill="${accent}"/>${windows(70, 62, 9, 2, 16, 12, 5, 8, "#9FB4C6")}<rect x="148" y="84" width="24" height="20" fill="#6D7F95"/>${tree(34, 86)}${tree(288, 86)}`;
    case "loft":
      return `<rect x="84" y="28" width="152" height="76" fill="#B5694D"/><rect x="84" y="28" width="152" height="6" fill="#8E4F3A"/>${windows(96, 42, 5, 2, 20, 18, 8, 10, "#3F4D5C")}<rect x="146" y="86" width="28" height="18" fill="#3F4D5C"/><rect x="84" y="96" width="152" height="8" fill="${accent}" opacity=".9"/>${tree(52, 86)}${tree(268, 86, "#8C9463")}`;
    case "hotel":
      return `<rect x="92" y="14" width="136" height="90" fill="#FFFBF4"/>${windows(102, 24, 7, 5, 12, 9, 6, 6, "#C9D6E0")}<path d="M120 84h80l-6-10h-68z" fill="${accent}"/><rect x="146" y="84" width="28" height="20" fill="#8FA7B8"/><path d="M60 104V60M260 104V60" stroke="#5A4A3A" stroke-width="2"/><path d="M60 60l16 5-16 5M260 60l16 5-16 5" fill="${accent}"/>`;
    case "site":
      return `<path d="M200 104V14M200 14h96M290 14v22" stroke="#C6A15B" stroke-width="5"/><rect x="286" y="36" width="10" height="10" fill="#49355F"/><rect x="70" y="40" width="110" height="64" fill="none" stroke="#8C9BAE" stroke-width="4"/><path d="M70 62h110M70 84h110M106 40v64M143 40v64" stroke="#8C9BAE" stroke-width="3"/><rect x="40" y="94" width="60" height="10" fill="#F2A889"/><path d="M44 94l8 10M56 94l8 10M68 94l8 10M80 94l8 10" stroke="#FFFBF4" stroke-width="3"/>`;
    case "store":
      return `<rect x="70" y="36" width="180" height="68" fill="#FFFBF4"/><path d="M64 36h192v14H64z" fill="${accent}"/>${stripes(64, 8, 24)}<rect x="84" y="58" width="60" height="46" fill="#C9D6E0"/><rect x="176" y="58" width="60" height="46" fill="#C9D6E0"/><rect x="148" y="66" width="24" height="38" fill="#6D7F95"/><circle cx="104" cy="68" r="6" fill="#8E7AAB"/><path d="M98 76h12l-2 22h-8z" fill="#8E7AAB"/><circle cx="204" cy="68" r="6" fill="#E0876A"/><path d="M198 76h12l-2 22h-8z" fill="#E0876A"/>`;
    case "warehouse":
      return `<path d="M50 104V52l110-26 110 26v52z" fill="#C4BBA8"/><rect x="80" y="70" width="40" height="34" fill="#8C8474"/><rect x="140" y="70" width="40" height="34" fill="#8C8474"/><rect x="200" y="70" width="40" height="34" fill="#8C8474"/><rect x="50" y="50" width="220" height="6" fill="${accent}"/>${tree(24, 86)}${tree(296, 86)}`;
    case "cafe":
    case "restaurant":
      return `<rect x="90" y="40" width="140" height="64" fill="#FFFBF4"/><path d="M84 40h152v14H84z" fill="${type === "cafe" ? "#747A4C" : "#E0876A"}"/>${stripes(84, 6, 26)}<rect x="102" y="62" width="50" height="42" fill="#C9D6E0"/><rect x="170" y="62" width="30" height="42" fill="#6D7F95"/><circle cx="160" cy="26" r="11" fill="#FFFBF4" stroke="#49355F" stroke-width="2"/><path d="M155 23h9v6a4 4 0 0 1-9 0zM164 25h2a2 2 0 0 1 0 4h-2" stroke="#49355F" stroke-width="1.6" fill="none"/>${tree(268, 86)}`;
    case "yoga":
      return `<rect x="90" y="42" width="140" height="62" fill="#EEE7F7"/><path d="M84 42l76-24 76 24z" fill="#747A4C"/><rect x="104" y="58" width="112" height="30" fill="#C9D6E0"/><circle cx="160" cy="66" r="5" fill="#49355F"/><path d="M160 71v10M150 76l10-4 10 4M154 88l6-7 6 7" stroke="#49355F" stroke-width="2.4" stroke-linecap="round" fill="none"/>${tree(50, 86)}${tree(274, 86, "#8C9463")}`;
    case "cowork":
      return `<rect x="100" y="16" width="120" height="88" fill="#6D7F95"/>${windows(108, 24, 5, 7, 16, 7, 6, 4, "#E9D9A8")}<rect x="148" y="86" width="24" height="18" fill="#3F4D5C"/>${tree(60, 86)}${tree(262, 86)}`;
    case "park":
      return `<path d="M0 118C80 100 140 96 320 108V130H0z" fill="#9AA46E"/><path d="M60 130C120 104 180 100 260 96" stroke="#E9DDC4" stroke-width="10" fill="none" stroke-linecap="round"/>${tree(60, 70)}${tree(96, 62, "#8C9463")}${tree(236, 58)}${tree(276, 70, "#8C9463")}<circle cx="170" cy="72" r="4" fill="#49355F"/><path d="M170 76v10M166 90l4-4 4 4" stroke="#49355F" stroke-width="2"/><circle cx="186" cy="74" r="4" fill="#E0876A"/><path d="M186 78v10M182 92l4-4 4 4" stroke="#E0876A" stroke-width="2"/>`;
    case "community":
      return `<rect x="96" y="46" width="128" height="58" fill="#FFFBF4"/><path d="M88 48l72-30 72 30z" fill="${accent}"/><rect x="112" y="60" width="96" height="30" fill="#C9D6E0"/><rect x="148" y="84" width="24" height="20" fill="#6D7F95"/>${tree(52, 86)}${tree(270, 86)}`;
    case "group":
    default:
      return `<circle cx="130" cy="60" r="18" fill="#C9B8E4"/><circle cx="170" cy="54" r="22" fill="#8E7AAB"/><circle cx="206" cy="62" r="16" fill="#F2A889"/><path d="M100 104c0-20 16-30 30-30s30 10 30 30M140 104c0-24 14-36 30-36s32 12 32 36M180 104c0-18 12-26 26-26s24 8 24 26" fill="#FFFBF4" opacity=".9"/>`;
  }
}

export function sceneSvg(type: SceneType, accent: string): string {
  const sky = type === "park" ? "#DCE8EE" : "#E7EEF3";
  const ground = type === "park" ? "" : GROUND;
  return `<svg viewBox="0 0 320 130" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style="display:block;width:100%;height:100%"><rect width="320" height="130" fill="${sky}"/><circle cx="286" cy="24" r="12" fill="#F6E3B4"/>${ground}${body(type, accent)}</svg>`;
}

const LOGO_COLORS: [string, string][] = [
  ["#49355F", "#F7F0E3"], ["#F2A889", "#2F2140"], ["#747A4C", "#F7F0E3"],
  ["#C6A15B", "#2F2140"], ["#C9B8E4", "#2F2140"], ["#2F2140", "#F2A889"],
];

/** Placeholder monogram until a company uploads its logo. */
export function monogram(name: string): { bg: string; fg: string; initials: string } {
  let h = 0;
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const [bg, fg] = LOGO_COLORS[h % LOGO_COLORS.length] ?? LOGO_COLORS[0]!;
  const initials = name
    .replace(/[^A-Za-z ]/g, "")
    .split(/\s+/)
    .filter((w) => w && !/^(of|and|the)$/i.test(w))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
  return { bg, fg, initials };
}
