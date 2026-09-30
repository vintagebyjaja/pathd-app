export const PORTFOLIO_MAX_BYTES = 25 * 1024 * 1024; // 25 MB
export const PORTFOLIO_MAX_ITEMS = 10;
export const PORTFOLIO_BUCKET = "portfolios";

export type PortfolioVisibility = "private" | "link" | "connections" | "employers";
export type PortfolioStatus = "pending" | "ready" | "rejected";

export const VISIBILITY_LABEL: Record<PortfolioVisibility, string> = {
  private: "Only me",
  link: "Anyone with the link",
  connections: "My connections",
  employers: "Employers I apply to",
};

export const VISIBILITY_HELP: Record<PortfolioVisibility, string> = {
  private: "Hidden from everyone but you.",
  link: "Share a private link with firms, clients or peers. Turn it off anytime.",
  connections: "Visible on your profile to people you're connected with.",
  employers: "Sent with applications and visible to employers you apply to.",
};

export interface PortfolioItemView {
  id: string;
  title: string;
  description: string | null;
  sizeBytes: number;
  status: PortfolioStatus;
  visibility: PortfolioVisibility;
  createdAt: string;
  shareUrl: string | null;
}

export function formatBytes(n: number): string {
  if (n < 1024 * 1024) return `${Math.max(1, Math.round(n / 1024))} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

/** Checks a file really starts like a PDF ("%PDF-"), not just that it's named .pdf. */
export function looksLikePdf(firstBytes: Uint8Array): boolean {
  return firstBytes.length >= 5 && String.fromCharCode(...firstBytes.slice(0, 5)) === "%PDF-";
}

export function newShareToken(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
