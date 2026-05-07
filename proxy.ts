import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  SUPER_ADMIN:      ["/dashboard/admin"],
  ADMIN:            ["/dashboard/admin"],
  COORDINATOR:      ["/dashboard/coordinator"],
  RLDC_ADMIN:       ["/dashboard/admin"],
  RLDC_COORDINATOR: ["/dashboard/coordinator"],
  RLDC_USER:        ["/dashboard/user"],
  RLDC_ANALYST:     ["/dashboard/user"],
  USER:             ["/dashboard/user"],
};

function isAuthorized(role: string, pathname: string): boolean {
  const allowedPaths = ROLE_ROUTES[role] ?? [];
  return allowedPaths.some((path) => pathname.startsWith(path));
}

export async function proxy(req: NextRequest) {
  const role           = req.cookies.get("role")?.value;
  const userId         = req.cookies.get("userId")?.value;
  const rememberToken  = req.cookies.get("remember_token")?.value;
  const { pathname }   = req.nextUrl;

  // 1. Session valid — check role authorization
  if (userId && role) {
    if (!isAuthorized(role, pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 2. No session but remember_token exists — try restore
  if (!userId && rememberToken) {
    try {
      const refreshRes = await fetch(new URL("/api/auth/login", req.url), {
        method: "GET",
        headers: { cookie: req.headers.get("cookie") ?? "" },
      });

      if (refreshRes.ok) {
        const resData = await refreshRes.json();
        const restoredRole = resData.user?.role;

        const response = isAuthorized(restoredRole, pathname)
          ? NextResponse.next()
          : NextResponse.redirect(new URL("/login", req.url));

        refreshRes.headers.getSetCookie().forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });

        return response;
      }
    } catch {
      // fall through to redirect
    }
  }

  // 3. No session, no token — redirect to login
  const response = NextResponse.redirect(new URL("/login", req.url));
  response.cookies.delete("userId");
  response.cookies.delete("role");
  response.cookies.delete("remember_token");
  return response;
}

export const config = {
  matcher: [
    "/dashboard/admin/:path*",
    "/dashboard/coordinator/:path*",
    "/dashboard/user/:path*",
  ],
};