import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const role = req.cookies.get("role")?.value;
  const userId = req.cookies.get("userId")?.value;
  const { pathname } = req.nextUrl;

  // Not logged in — redirect to login
  if (!userId && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based protection
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/coordinator") && role !== "COORDINATOR") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (pathname.startsWith("/dashboard") && role !== "USER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/coordinator/:path*"],
};