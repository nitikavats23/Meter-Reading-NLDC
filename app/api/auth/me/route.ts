import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {

    // =========================
    // GET USER ID FROM COOKIE
    // =========================

     const allCookies = req.cookies.getAll();
    console.log("All cookies received:", allCookies);

    const userId = req.cookies.get("userId")?.value;
    console.log("userId cookie:", userId);

    if (!userId) {
      return NextResponse.json(
        {
          error: "No session found",
        },
        {
          status: 401,
        }
      );
    }

    // =========================
    // FIND USER
    // =========================

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      include: {
        profile: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    // =========================
    // RETURN SESSION
    // =========================

    return NextResponse.json({
  admin: {
    id: user.id,
    fullName: user.profile?.fullName || "",
    email: user.profile?.email || "",
    region: (user.profile?.region || "NR") as "NR" | "WR" | "SR" | "ER" | "NER",
    rldc: user.profile?.rldc || "NRLDC",
  },
});
  } catch (error) {

    console.error("AUTH ME ERROR:", error);

    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}