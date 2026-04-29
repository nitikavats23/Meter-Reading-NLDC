import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const { userId, action, role, approverId, remarks } = body;

  // Update approval
  await prisma.approval.updateMany({
    where: {
      userId,
      status: "Pending",
    },
    data: {
      status:
        action === "approve"
          ? "CoordinatorApproved"
          : "CoordinatorRejected",
      remarks,
    },
  });

  // Assign role
  await prisma.roleAssignment.upsert({
    where: { userId },
    update: {
      role,
      approverId,
    },
    create: {
      userId,
      role,
      approverId,
    },
  });

  return NextResponse.json({ success: true });
}