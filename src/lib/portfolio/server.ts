import "server-only";
import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { PortfolioItemView, PortfolioStatus, PortfolioVisibility } from "./types";

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function shareUrlFor(token: string): string {
  return `${siteUrl()}/p/${token}`;
}

export const jsonError = (message: string, status: number) => NextResponse.json({ error: message }, { status });

/** Signed-in member's Supabase client, or an error response. */
export async function memberClient() {
  if (!isSupabaseConfigured) return { error: jsonError("Portfolio uploads need PATHD accounts, which aren't connected yet.", 503) } as const;
  const { createSupabaseServerClient } = await import("@/lib/supabase/server");
  const sb = await createSupabaseServerClient();
  const { data } = await sb.auth.getUser();
  if (!data.user) return { error: jsonError("Sign in to manage your portfolio.", 401) } as const;
  return { sb, userId: data.user.id } as const;
}

export interface PortfolioRow {
  id: string;
  title: string;
  description: string | null;
  size_bytes: number;
  status: PortfolioStatus;
  visibility: PortfolioVisibility;
  created_at: string;
  storage_path: string;
  portfolio_share_links?: { token: string; revoked_at: string | null; expires_at: string | null }[] | null;
}

export function toView(r: PortfolioRow): PortfolioItemView {
  const now = Date.now();
  const live = (r.portfolio_share_links ?? []).find(
    (l) => !l.revoked_at && (!l.expires_at || new Date(l.expires_at).getTime() > now),
  );
  return {
    id: r.id,
    title: r.title,
    description: r.description,
    sizeBytes: r.size_bytes,
    status: r.status,
    visibility: r.visibility,
    createdAt: r.created_at,
    shareUrl: live ? shareUrlFor(live.token) : null,
  };
}

export const PORTFOLIO_SELECT =
  "id, title, description, size_bytes, status, visibility, created_at, storage_path, portfolio_share_links(token, revoked_at, expires_at)";
