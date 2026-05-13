import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // This is the CoordinatorApproved approval row from the queue
    const approval = await prisma.approval.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            profile: true,
            role: true,
            entity: true,
            meters: true,
            qcaDetails: true,
            associateManagers: true,
            // ← get ALL approval rows for this user
            approvals: {
              orderBy: { createdAt: "asc" },
            },
          },
        },
      },
    });

    if (!approval) {
      return NextResponse.json({ error: "Record not found" }, { status: 404 });
    }

    const allApprovals = approval.user.approvals;


    // The first row is the original submission (Pending)
    const submissionRow = allApprovals.find(
      (a) => a.status === "Pending" || a.status === "CoordinatorApproved"
    );

    // The CoordinatorApproved row has the coordinator's id as approverId
    const coordinatorApprovalRow = allApprovals.find(
      (a) => a.status === "CoordinatorApproved"
    );

    const coordinatorId = coordinatorApprovalRow?.approverId;
    const isRealCoordinatorId = coordinatorId && coordinatorId !== "PENDING";

    const coordinator = isRealCoordinatorId
      ? await prisma.user.findUnique({
          where: { id: coordinatorId },
          include: { profile: true },
        })
      : null;

    const record = {
      id: approval.id,
      regNumber: `REG-${approval.id.slice(0, 8).toUpperCase()}`,
      applicantName: approval.user.profile?.fullName ?? approval.user.username,
      applicantEmail: approval.user.profile?.email ?? "",
      applicantPhone: approval.user.profile?.phone ?? "",
      registrationType: approval.user.role?.role ?? "UNKNOWN",
      entityName: approval.user.entity?.entityName ?? "",
      entityType: approval.user.userType ?? "",
      assignedRole: approval.user.role?.role ?? "",
      documents: [],
      coordinator: coordinator
        ? {
            id: coordinator.id,
            name: coordinator.profile?.fullName ?? coordinator.username,
            email: coordinator.profile?.email ?? "",
          }
        : null,
      coordinatorRemarks: coordinatorApprovalRow?.remarks ?? null,
      // ← now these are two different timestamps
      coordinatorApprovedAt: coordinatorApprovalRow?.createdAt.toISOString() ?? null,
      submittedAt: submissionRow?.createdAt.toISOString() 
        ?? allApprovals[0]?.createdAt.toISOString() 
        ?? approval.createdAt.toISOString(),
    };

    return NextResponse.json(record, { status: 200 });

  } catch (error) {
    console.error("REGISTRATION RECORD ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch registration record" },
      { status: 500 }
    );
  }
}