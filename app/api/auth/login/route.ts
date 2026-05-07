import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/utils/hash";
import crypto from "crypto";

const isProd = process.env.NODE_ENV === "production";
const REMEMBER_ME_AGE = 60 * 60 * 24 * 30; // 30 days
const DEFAULT_AGE = 60 * 60 * 24;           // 24 hours

function setAuthCookies(
  response: NextResponse,
  userId: string,
  role: string,
  maxAge: number,
  rememberToken?: string
) {
  if (rememberToken) {
    response.cookies.set("remember_token", rememberToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }

  response.cookies.set("userId", userId, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  response.cookies.set("role", role, {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

// ─── POST /api/auth/login ────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { identifier, password, captcha, role, rememberMe } = await req.json();

    // 1. Validation
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
    const approval = await prisma.approval.findFirst({
  where: { userId: user.id },
  orderBy: { createdAt: "desc" },
});

if (!approval || approval.status !== "Activated") {
  return NextResponse.json(
    { message: "Your account is not activated yet" },
    { status: 403 }
  );
}

    // 4. Build Response
    const cookieAge = rememberMe ? REMEMBER_ME_AGE : DEFAULT_AGE;

    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: { userId: user.id, role: roleAssignment.role },
    });

    // 5. Handle Remember Me — create persistent token
    let persistentToken: string | undefined;

    if (rememberMe) {
      await prisma.userToken.deleteMany({ where: { userId: user.id } });

      persistentToken = crypto.randomBytes(64).toString("hex");

      await prisma.userToken.create({
        data: {
          token: persistentToken,
          userId: user.id,
          expiresAt: new Date(Date.now() + cookieAge * 1000),
        },
      });
    }

    // 6. Set Cookies
    setAuthCookies(response, user.id, roleAssignment.role, cookieAge, persistentToken);

    return response;

  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ─── GET /api/auth/login (token refresh / session restore) ───────────────────
export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("remember_token="))
      ?.split("=")[1]
      ?.trim();

    if (!token) {
      return NextResponse.json({ message: "No remember token" }, { status: 401 });
    }

    const stored = await prisma.userToken.findUnique({
      where: { token },
    });

    if (!stored || stored.expiresAt < new Date()) {
      if (stored) {
        await prisma.userToken.delete({ where: { token } });
      }

      const response = NextResponse.json(
        { message: "Session expired, please log in again" },
        { status: 401 }
      );
      response.cookies.delete("remember_token");
      response.cookies.delete("userId");
      response.cookies.delete("role");
      return response;
    }

    const roleAssignment = await prisma.roleAssignment.findUnique({
      where: { userId: stored.userId },
    });

    if (!roleAssignment) {
      return NextResponse.json({ message: "Role not found" }, { status: 403 });
    }

    const newToken = crypto.randomBytes(64).toString("hex");
    const newExpiry = new Date(Date.now() + REMEMBER_ME_AGE * 1000);

    await prisma.userToken.update({
      where: { token },
      data: { token: newToken, expiresAt: newExpiry },
    });

    const response = NextResponse.json({
      success: true,
      message: "Session restored",
      user: { userId: stored.userId, role: roleAssignment.role },
    });

    setAuthCookies(response, stored.userId, roleAssignment.role, REMEMBER_ME_AGE, newToken);

    return response;

  } catch (error) {
    console.error("SESSION RESTORE ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}