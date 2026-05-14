


import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // 1. Identify the Admin via Header
    // The frontend fetch call must include: headers: { "x-admin-id": session.id }
    const adminId = req.headers.get("x-admin-id");

    if (!adminId) {
      return NextResponse.json(
        { error: "Unauthorized: Admin ID missing in headers" },
        { status: 401 }
      );
    }

    // 2. Fetch the Admin's assigned RLDC from the Database
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      include: { entity: true },
    });

    const adminRegion = adminUser?.entity?.rldc;

    // SECURITY: If the admin has no assigned region, do not show any data.
    if (!adminRegion) {
      console.error(`Security Alert: Admin ${adminId} has no assigned RLDC region.`);
      return NextResponse.json([], { status: 200 });
    }

    // 3. Fetch data STRICTLY filtered by the Admin's region
    const approvals = await prisma.approval.findMany({
      where: {
        // Condition 1: Must have been approved by the Coordinator first
        status: "CoordinatorApproved", 
        
        // Condition 2: The applicant must belong to the same RLDC as the Admin
        user: {
          entity: {
            rldc: adminRegion, // Strict server-side filtering
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
            entity: true,
          },
        },
      },
    });

    // 4. Format the data for the frontend table
    const items = approvals.map((approval) => ({
      id: approval.id,
      regNumber: `REG-${approval.id.slice(0, 8).toUpperCase()}`,
      applicantName: approval.user.profile?.fullName ?? approval.user.username,
      registrationType: approval.user.role?.role ?? "UNKNOWN",
      coordinatorApprovedAt: approval.createdAt.toISOString(),
      region: approval.user.entity?.rldc, // Added for UI verification
    }));

    return NextResponse.json(items, { status: 200 });

  } catch (error) {
    console.error("CRITICAL ERROR IN ADMIN FILTER:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}