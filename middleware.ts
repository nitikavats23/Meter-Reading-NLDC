import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // Protect coordinator routes
  if (pathname.startsWith("/coordinator")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.userType !== "Coordinator") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Protect user dashboard
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (token.userType === "Coordinator") {
      return NextResponse.redirect(new URL("/coordinator", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/coordinator/:path*"],
};