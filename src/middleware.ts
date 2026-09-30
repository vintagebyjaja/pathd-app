import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

const PROTECTED = ["/home", "/profile", "/onboarding", "/applications", "/settings"];

/**
 * Refreshes the Supabase session cookie and guards member-only routes.
 * In demo mode (no Supabase env) everything is open and shows demo data.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isStaffPath = request.nextUrl.pathname === "/admin" || request.nextUrl.pathname.startsWith("/admin/");
  if (!url || !key) return isStaffPath ? withNoIndex(NextResponse.next()) : NextResponse.next();

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet: { name: string; value: string; options: CookieOptions }[]) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  // Staff pages handle access themselves: non-staff see the "road closed,
  // rerouting" screen and are sent to their dashboard (signed in) or home.
  if (isStaffPath) return withNoIndex(response);
  if (!user && PROTECTED.some((p) => path === p || path.startsWith(`${p}/`))) {
    const to = request.nextUrl.clone();
    to.pathname = "/sign-in";
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  }
  return response;
}

function withNoIndex(res: NextResponse) {
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|brand/|favicon.ico|.*\\.(?:png|svg|jpg|webp)$).*)"],
};
