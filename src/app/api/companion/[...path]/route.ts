import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { companionFetch } from "@/lib/companion/server";
export const dynamic = "force-dynamic";
async function route(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  try {
    if (
      req.method !== "GET" &&
      req.headers.get("origin") !== new URL(req.url).origin
    )
      return NextResponse.json({ error: "Origin denied" }, { status: 403 });
    const path = "/" + (await params).path.join("/");
    const sb = await createSupabaseServerClient();
    const {
      data: { user },
    } = await sb.auth.getUser();
    const {
      data: { session },
    } = await sb.auth.getSession();
    if (!user && !path.startsWith("/recovery/reset"))
      return NextResponse.json(
        { error: "Sign in to continue." },
        { status: 401 },
      );
    const token = session?.access_token;
    if (path === "/career/import" && req.method === "POST") {
      const d = await req.json();
      if (d.consent !== true)
        return NextResponse.json(
          { error: "Consent required" },
          { status: 403 },
        );
      const { getCurrentMember } = await import("@/lib/data/member");
      const m = await getCurrentMember();
      if (!m || m.isDemo || m.id !== user?.id)
        return NextResponse.json(
          { error: "Your live career profile is not available." },
          { status: 404 },
        );
      const prefs = m.matchProfile.preferences;
      const details = {
        career_goal: m.careerGoal,
        desired_roles: prefs.desiredRoles,
        industries: prefs.industries,
        city: m.city,
        skills: m.skills,
        certifications: m.certifications,
        licenses: m.licenses,
        current_role: m.currentRole,
      };
      const consent = await companionFetch(
        "/account",
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ career_consent: true }),
        },
        token,
      );
      if (!consent.ok) return consent;
      // Reuse the same imported profile record; refreshes do not accumulate redundant profiles.
      const existing = await companionFetch("/career/records", {}, token);
      if (!existing.ok) return existing;
      const rows = await existing.json();
      const previous = rows.items.find(
        (r: any) => r.kind === "profile" && r.title === "PATHD Career Profile",
      );
      return companionFetch(
        "/career/records" + (previous ? "/" + previous.id : ""),
        {
          method: previous ? "PATCH" : "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            kind: "profile",
            title: "PATHD Career Profile",
            data: details,
          }),
        },
        token,
      );
    }

    if (
      !/^\/(account(?:\/export)?|recovery\/(enroll|reset)|agents|conversations(?:\/[a-f0-9-]+(?:\/(messages|respond|cancel))?)?|career\/(records|reminders|notifications)(?:\/[a-f0-9-]+)?)$/.test(
        path,
      )
    )
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (path === "/agents" && req.method !== "GET")
      return NextResponse.json(
        { error: "PATHD offers AELIO and MILA only." },
        { status: 403 },
      );
    const cm = path.match(/^\/conversations\/([a-f0-9-]+)/);
    if (cm) {
      const check = await companionFetch("/conversations", {}, token);
      if (!check.ok) return check;
      const data = await check.json();
      if (
        !data.conversations.some(
          (c: any) => c.id === cm[1] && c.product === "pathd",
        )
      )
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    let data: any = undefined;
    if (req.method !== "GET" && req.method !== "DELETE") {
      if (Number(req.headers.get("content-length") || 0) > 40000)
        return NextResponse.json(
          { error: "Request too large" },
          { status: 413 },
        );
      data = await req.json();
      if (path === "/conversations") data.product = "pathd";
    }
    const upstream = await companionFetch(
      path,
      {
        method: req.method,
        headers: {
          "content-type": "application/json",
          ...(req.headers.get("cf-connecting-ip")
            ? { "cf-connecting-ip": req.headers.get("cf-connecting-ip")! }
            : {}),
        },
        body: data === undefined ? undefined : JSON.stringify(data),
      },
      token,
    );
    if (
      upstream.ok &&
      req.method === "GET" &&
      (path === "/agents" || path === "/conversations")
    ) {
      const d = await upstream.json();
      if (d.agents)
        d.agents = d.agents.filter((a: any) =>
          ["aelio", "mila"].includes(a.kind),
        );
      if (d.conversations)
        d.conversations = d.conversations.filter(
          (c: any) => c.product === "pathd",
        );
      return NextResponse.json(d, { headers: { "cache-control": "no-store" } });
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") || "application/json",
        "cache-control": "no-cache, no-store, no-transform",
        "x-accel-buffering":"no",
      },
    });
  } catch {
    console.error(JSON.stringify({ event: "pathd_companion_unavailable" }));
    return NextResponse.json(
      {
        error:
          "Your account is available, but the companion service is not connected.",
        code: "companion_unavailable",
      },
      { status: 503 },
    );
  }
}
export { route as GET, route as POST, route as PATCH, route as DELETE };
