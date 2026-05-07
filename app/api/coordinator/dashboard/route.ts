import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const userId = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("userId="))
      ?.split("=")[1]
      ?.trim();

    const role = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("role="))
      ?.split("=")[1]
      ?.trim();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "COORDINATOR" && role !== "RLDC_COORDINATOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch coordinator's full profile
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        role: true,
        entity: true,
        meters: true,
        qcaDetails: true,
        associateManagers: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch all pending requests (not assigned to anyone yet)
    const pendingRequests = await prisma.approval.findMany({
      where: { status: "Pending" },
      include: {
        user: {
          include: { profile: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch requests actioned by this coordinator
    const myActionedRequests = await prisma.approval.findMany({
      where: {
        approverId: userId,
        status: "CoordinatorApproved",
      },
      include: {
        user: {
          include: { profile: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Stats
    const [totalActioned, approvedCount, rejectedCount] = await Promise.all([
      prisma.approval.count({ where: { approverId: userId } }),
      prisma.approval.count({ where: { approverId: userId, status: "CoordinatorApproved" } }),
      prisma.approval.count({ where: { approverId: userId, status: "Rejected" } }),
    ]);

    const { password, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
      stats: {
        pendingCount: pendingRequests.length,
        totalActioned,
        approvedCount,
        rejectedCount,
        meterCount: user.meters.length,
        managerCount: user.associateManagers.length,
      },
      pendingRequests,
      myActionedRequests,
    });
  } catch (error) {
    console.error("COORDINATOR DASHBOARD ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}