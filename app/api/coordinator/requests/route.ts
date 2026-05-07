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

    // Fetch all pending approval requests
    const pendingRequests = await prisma.approval.findMany({
      where: {
        status: "Pending",
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
            entity: true,
            meters: true,
            qcaDetails: true,
            associateManagers: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Fetch already actioned by this coordinator
    const actionedRequests = await prisma.approval.findMany({
      where: {
        approverId: userId,
        status: "CoordinatorApproved",
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      pendingRequests,
      actionedRequests,
      counts: {
        pending: pendingRequests.length,
        actioned: actionedRequests.length,
      },
    });
  } catch (error) {
    console.error("COORDINATOR REQUESTS ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Reject a request
export async function DELETE(req: Request) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";

    const approverId = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("userId="))
      ?.split("=")[1]
      ?.trim();

    const role = cookieHeader
      .split(";")
      .find((c) => c.trim().startsWith("role="))
      ?.split("=")[1]
      ?.trim();

    if (!approverId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "COORDINATOR" && role !== "RLDC_COORDINATOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { registrationId, remarks } = await req.json();

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID missing" }, { status: 400 });
    }

    const pendingApproval = await prisma.approval.findFirst({
      where: { userId: registrationId, status: "Pending" },
    });

    if (!pendingApproval) {
      return NextResponse.json({ error: "No pending approval found" }, { status: 404 });
    }

    await prisma.approval.updateMany({
      where: {
        userId: registrationId,
        status: "Pending",
      },
      data: {
        status: "Rejected",
        remarks: remarks || "Rejected by coordinator",
        approverId,
      },
    });

    return NextResponse.json({ message: "Request rejected successfully" });
  } catch (error) {
    console.error("COORDINATOR REJECT ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}