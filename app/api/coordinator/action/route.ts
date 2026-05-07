import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
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

    // Auth check
    if (!approverId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (role !== "COORDINATOR" && role !== "RLDC_COORDINATOR") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { registrationId, assignedRole, remarks } = body;

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID missing" }, { status: 400 });
    }

    if (!assignedRole || !(assignedRole in Role)) {
      return NextResponse.json({ error: "Invalid role provided" }, { status: 400 });
    }

    // Check if the user to approve actually exists
    const targetUser = await prisma.user.findUnique({
      where: { id: registrationId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if there's a pending approval to act on
    const pendingApproval = await prisma.approval.findFirst({
      where: { userId: registrationId, status: "Pending" },
    });

    if (!pendingApproval) {
      return NextResponse.json({ error: "No pending approval found for this user" }, { status: 404 });
    }

    // Transaction: update approval status + upsert role assignment
    await prisma.$transaction([
      prisma.approval.updateMany({
        where: {
          userId: registrationId,
          status: "Pending",
        },
        data: {
          status: "CoordinatorApproved",
          remarks: remarks || "",
          approverId: approverId,
        },
      }),

      prisma.roleAssignment.upsert({
        where: { userId: registrationId },
        update: {
          role: assignedRole as Role,
          approverId: approverId,
        },
        create: {
          userId: registrationId,
          role: assignedRole as Role,
          approverId: approverId,
        },
      }),
    ]);

    return NextResponse.json({ message: "Success! Forwarded to Admin" });
  } catch (error) {
    console.error("COORDINATOR ACTION ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
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

    // Fetch all approvals actioned by this coordinator
    const actions = await prisma.approval.findMany({
      where: {
        approverId,
        status: "CoordinatorApproved",
      },
      include: {
        user: {
          include: { profile: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, actions });
  } catch (error) {
    console.error("COORDINATOR ACTION FETCH ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}