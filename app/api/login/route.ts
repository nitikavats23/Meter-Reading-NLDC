import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/utils/hash";

export async function POST(req: Request) {
  try {
    // 1. Accept all inputs including role
    const { identifier, password, captcha, role } = await req.json();

    // 2. Check inputs
    if (!identifier || !password || !captcha || !role) {
      return NextResponse.json(
        { message: "Missing credentials, role or captcha" },
        { status: 400 }
      );
    }

    // 3. Verify CAPTCHA
    const verifyRes = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captcha}`,
      }
    );

    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      return NextResponse.json(
        { message: "Captcha verification failed" },
        { status: 400 }
      );
    }

    // 4. Find user by username or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: identifier },
          { profile: { email: identifier } },
        ],
      },
      include: { profile: true },
    });

    if (!user) {
      return NextResponse.json(
        { message: "No account found" },
        { status: 404 }
      );
    }

    // 5. Verify password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid password" },
        { status: 401 }
      );
    }

    // 6. Verify role matches DB
    const roleAssignment = await prisma.roleAssignment.findUnique({
      where: { userId: user.id },
    });

    if (!roleAssignment) {
      return NextResponse.json(
        { message: "No role assigned to this account" },
        { status: 403 }
      );
    }

    if (roleAssignment.role !== role) {
      return NextResponse.json(
        { message: "Invalid role selected for this account" },
        { status: 403 }
      );
    }

    // 7. Success — set cookies and return user
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
      user: {
        userId: user.id,
        role: roleAssignment.role,
      },
    });

    response.cookies.set("userId", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    response.cookies.set("role", roleAssignment.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;

  } catch (error: unknown) {
    console.error("LOGIN ERROR:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}