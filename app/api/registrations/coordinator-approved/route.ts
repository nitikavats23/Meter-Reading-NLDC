import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const rldc = req.nextUrl.searchParams.get("rldc");

    const approvals = await prisma.approval.findMany({
      where: {
        status: "CoordinatorApproved",
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
            meters: true,
            qcaDetails: true,
            associateManagers: true,
          },
        },
      },
    });

    type ApprovalWithUser = (typeof approvals)[number];

    const filtered: ApprovalWithUser[] = rldc
      ? approvals.filter((a: ApprovalWithUser) => a.user.entity?.rldc === rldc)
      : approvals;
   

    const items = filtered.map((approval: ApprovalWithUser) => ({
      id: approval.id,
      regNumber: `REG-${approval.id.slice(0, 8).toUpperCase()}`,
      applicantName: approval.user.profile?.fullName ?? approval.user.username,
      registrationType: approval.user.role?.role ?? "UNKNOWN",
      coordinatorApprovedAt: approval.createdAt.toISOString(),
    }));

    return NextResponse.json(items, { status: 200 });

  } catch (error) {
    console.error("COORDINATOR APPROVED QUEUE ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch coordinator-approved requests" },
      { status: 500 }
    );
  }
}

