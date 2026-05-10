import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { action, adminId, remarks } = await req.json();

    if (!action || !adminId) {
      return NextResponse.json(
        { error: "action and adminId are required" },
        { status: 400 }
      );
    }

    const approval = await prisma.approval.findUnique({
      where: { id },
    });

    if (!approval) {
      return NextResponse.json({ error: "Approval not found" }, { status: 404 });
    }

    if (approval.status !== "CoordinatorApproved") {
      return NextResponse.json(
        { error: "This request is not in CoordinatorApproved state" },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "AdminApproved" : "AdminRejected";

    await prisma.approval.update({
      where: { id },
      data: {
        status: newStatus,
        approverId: adminId,
        remarks: remarks || null,
      },
    });

    return NextResponse.json(
      { message: `Request ${newStatus} successfully` },
      { status: 200 }
    );

  } catch (error) {
    console.error("ADMIN REVIEW ERROR:", error);
    return NextResponse.json(
      { error: "Failed to process admin review" },
      { status: 500 }
    );
  }
}