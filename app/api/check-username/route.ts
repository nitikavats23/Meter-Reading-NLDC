import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    // 🔒 Basic validation
    if (!username || username.length < 5) {
      return NextResponse.json(
        { available: false, message: "Invalid username" },
        { status: 400 }
      );
    }

    // 🔍 Check in DB
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    // 🎯 Response
    return NextResponse.json({
      available: !existingUser,
    });

  } catch (error) {
    console.error("Username check error:", error);

    return NextResponse.json(
      { available: false, message: "Server error" },
      { status: 500 }
    );
  }
}