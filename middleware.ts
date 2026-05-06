import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ROLE_ROUTES: Record<string, string[]> = {
  SUPER_ADMIN: ["/admin"],
  ADMIN: ["/admin"],
  COORDINATOR: ["/coordinator"],
  RLDC_ADMIN: ["/admin"],
  RLDC_COORDINATOR: ["/coordinator"],
  RLDC_USER: ["/dashboard"],
  RLDC_ANALYST: ["/dashboard"],
  USER: ["/dashboard"],
};

function isAuthorized(role: string, pathname: string): boolean {
  const allowedPaths = ROLE_ROUTES[role] ?? [];
  return allowedPaths.some((path) => pathname.startsWith(path));
}

export async function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  const userId = req.cookies.get("userId")?.value;
  const rememberToken = req.cookies.get("remember_token")?.value;
  const { pathname } = req.nextUrl;

  // 1. Session is valid — check role authorization
  if (userId && role) {
    if (!isAuthorized(role, pathname)) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  // 2. No session but has remember_token — try to restore session
  if (!userId && rememberToken) {
    try {
      const refreshRes = await fetch(new URL("/api/auth/login", req.url), {
        method: "GET",
        headers: { cookie: req.headers.get("cookie") ?? "" },
      });

      if (refreshRes.ok) {
        const resData = await refreshRes.json();
        const restoredRole = resData.user?.role;

        // Build the next response and forward cookies from refresh
        const response = isAuthorized(restoredRole, pathname)
          ? NextResponse.next()
          : NextResponse.redirect(new URL("/login", req.url));

        refreshRes.headers.getSetCookie().forEach((cookie) => {
          response.headers.append("Set-Cookie", cookie);
        });

        return response;
      }
    } catch (_) {
      // Refresh failed — fall through to redirect
    }
  }

  // 3. No session, no token — redirect to login
  if (pathname !== "/login") {
    const response = NextResponse.redirect(new URL("/login", req.url));

    // Clear stale cookies if any
    response.cookies.delete("userId");
    response.cookies.delete("role");
    response.cookies.delete("remember_token");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/coordinator/:path*"],
};