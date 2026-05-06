import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { registrationId, assignedRole, approverId, remarks } = body;

    if (!registrationId) {
      return NextResponse.json({ error: "Registration ID missing" }, { status: 400 });
    }

    // 1. Transaction use karein taaki dono kaam ek saath ho ya ek bhi na ho
    await prisma.$transaction([
      // Status update karna
      prisma.approval.updateMany({
        where: { 
          userId: registrationId,
          status: "Pending" 
        },
        data: {
          status: "CoordinatorApproved",
          remarks: remarks || "",
          approverId: approverId,
        },
      }),

      // Role assignment set karna
      prisma.roleAssignment.upsert({
        where: { userId: registrationId },
        update: { 
          role: assignedRole as Role,
          approverId: approverId 
        },
        create: { 
          userId: registrationId, // Direct ID use karein, ye zyada safe hai
          role: assignedRole as Role,
          approverId: approverId || null
        },
      })
    ]);

    return NextResponse.json({ message: "Success! Forwarded to Admin" });
  } catch (error: any) {
    console.error("Prisma Transaction Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message }, 
      { status: 500 }
    );
  }
}