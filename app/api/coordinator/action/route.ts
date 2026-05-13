// app/api/coordinator/action/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { registrationId, assignedRole, remarks } = await req.json();

    if (!registrationId) {
      return NextResponse.json(
        { error: "registrationId is required" },
        { status: 400 }
      );
    }

    // 1. Get coordinator's userId from session cookie
    const cookieStore = await cookies();
    const coordinatorId = cookieStore.get("userId")?.value;

    

    // 2. Find the registering user's RLDC from their entity
    const registeringUser = await prisma.user.findUnique({
      where: { id: registrationId },
      include: { entity: true },
    });

    if (!registeringUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const userRldc = registeringUser.entity?.rldc;

    if (!userRldc) {
      return NextResponse.json(
        { error: "Registering user has no RLDC assigned" },
        { status: 400 }
      );
    }

    console.log(`[FORWARD] User RLDC: ${userRldc} — looking for matching RLDC_ADMIN`);

    // 3. Find the RLDC_ADMIN whose entity.rldc matches the user's rldc
    const matchingAdmin = await prisma.user.findFirst({
      where: {
        role: {
          role: "RLDC_ADMIN",
        },
        entity: {
          rldc: userRldc,
        },
        // Only consider activated admins
        approvals: {
          some: {
            status: "Activated",
          },
        },
      },
      include: {
        entity: true,
        role: true,
      },
    });

    if (!matchingAdmin) {
      return NextResponse.json(
        {
          error: `No active RLDC Admin found for region: ${userRldc}. Please contact the Super Admin.`,
        },
        { status: 404 }
      );
    }
        console.log("COORDINATOR ID FROM COOKIE:", coordinatorId);
console.log("MATCHING ADMIN ID:", matchingAdmin.id);
console.log("SAVING approverId AS:", coordinatorId);

    console.log(`[FORWARD] Matched admin: ${matchingAdmin.id} (${matchingAdmin.username}) for ${userRldc}`);

    // 4. Find the latest pending approval for this user
    const approval = await prisma.approval.findFirst({
      where: { userId: registrationId, status: "Pending" },
      orderBy: { createdAt: "desc" },
    });

    if (!approval) {
      return NextResponse.json(
        { error: "No pending approval found for this user" },
        { status: 404 }
      );
    }

    // Step 5 — update existing row to record coordinator's action
await prisma.approval.update({
  where: { id: approval.id },
  data: {
    status: "CoordinatorApproved",
    approverId: coordinatorId,   // ← the actual coordinator (Aditi)
    remarks: remarks || null,
  },
});

// Step 5b — create a new pending row targeted at the RLDC Admin
await prisma.approval.create({
  data: {
    userId: registrationId,
    status: "Pending",
    approverId: matchingAdmin.id,  // ← pre-assigned to the correct admin
    remarks: null,
  },
});

    // 6. Optionally update role assignment
    if (assignedRole) {
      await prisma.roleAssignment.updateMany({
        where: { userId: registrationId },
        data: { role: assignedRole },
      });
    }

    return NextResponse.json(
      {
        message: `Request forwarded to ${userRldc} Admin successfully`,
        routedTo: {
          adminId: matchingAdmin.id,
          adminUsername: matchingAdmin.username,
          rldc: userRldc,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("COORDINATOR ACTION ERROR:", error);
    return NextResponse.json(
      { error: "Failed to forward request" },
      { status: 500 }
    );
  }
  
}