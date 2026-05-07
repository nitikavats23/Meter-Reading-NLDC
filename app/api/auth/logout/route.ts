import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const token = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("remember_token="))
      ?.split("=")[1]
      ?.trim();

    // Delete token from DB if exists
    if (token) {
      await prisma.userToken.deleteMany({ where: { token } });
    }

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // Clear all auth cookies
    response.cookies.set("userId", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("role", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("remember_token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;

  } catch (error) {
    console.error("LOGOUT ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}