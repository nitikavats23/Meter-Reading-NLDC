import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // Abhi ke liye redirection ko bypass karte hain 
  // taaki tum development kar sako bina login page ke
  
  // Agar tum check karna chahte ho ki path sahi hai ya nahi:
  console.log("Current Path:", pathname);

  return NextResponse.next();
}

// Matcher ko waisa hi rehne do
export const config = {
  matcher: ["/dashboard/:path*", "/coordinator/:path*"],
};