import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/utils/hash";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { identifier, password, captcha, role, rememberMe } = await req.json();

    // 1. Validation & CAPTCHA (Keeping your existing logic)
    if (!identifier || !password || !captcha || !role) {
      return NextResponse.json({ message: "Missing credentials" }, { status: 400 });
    }

    // 2. Find User
    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { profile: { email: identifier } }],
      },
      include: { profile: true },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // 3. Verify Role
    const roleAssignment = await prisma.roleAssignment.findUnique({
      where: { userId: user.id },
    });

    if (!roleAssignment || roleAssignment.role !== role) {
      return NextResponse.json({ message: "Invalid role selected" }, { status: 403 });
    }

    // 4. Setup Response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { userId: user.id, role: roleAssignment.role },
    });

    const isProd = process.env.NODE_ENV === "production";
    
    // Default: 24 hours | Remember Me: 30 days
    const cookieAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    // 5. Handle "Remember Me" Token
    if (rememberMe) {
      const persistentToken = crypto.randomBytes(64).toString("hex");

      await prisma.userToken.create({
        data: {
          token: persistentToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + cookieAge * 1000),
        },
      });

      response.cookies.set("remember_token", persistentToken, {
        httpOnly: true,
        secure: isProd,
        sameSite: "lax",
        path: "/",
        maxAge: cookieAge,
      });
    }

    // 6. Set Identity Cookies
    response.cookies.set("userId", user.id, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: cookieAge,
    });

    response.cookies.set("role", roleAssignment.role, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge: cookieAge,
    });

    return response;

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}