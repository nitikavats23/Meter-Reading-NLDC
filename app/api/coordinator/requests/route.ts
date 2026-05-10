// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(req: Request) {
//   try {
//     const cookieHeader = req.headers.get("cookie") || "";

//     const userId = cookieHeader
//       .split(";")
//       .find((c) => c.trim().startsWith("userId="))
//       ?.split("=")[1]
//       ?.trim();

//     const role = cookieHeader
//       .split(";")
//       .find((c) => c.trim().startsWith("role="))
//       ?.split("=")[1]
//       ?.trim();

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (role !== "COORDINATOR" && role !== "RLDC_COORDINATOR") {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     // Fetch all pending approval requests
//     const pendingRequests = await prisma.approval.findMany({
//       where: {
//         status: "Pending",
//       },
//       include: {
//         user: {
//           include: {
//             profile: true,
//             role: true,
//             entity: true,
//             meters: true,
//             qcaDetails: true,
//             associateManagers: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     // Fetch already actioned by this coordinator
//     const actionedRequests = await prisma.approval.findMany({
//       where: {
//         approverId: userId,
//         status: "CoordinatorApproved",
//       },
//       include: {
//         user: {
//           include: {
//             profile: true,
//             role: true,
//           },
//         },
//       },
//       orderBy: { createdAt: "desc" },
//     });

//     return NextResponse.json({
//       success: true,
//       pendingRequests,
//       actionedRequests,
//       counts: {
//         pending: pendingRequests.length,
//         actioned: actionedRequests.length,
//       },
//     });
//   } catch (error) {
//     console.error("COORDINATOR REQUESTS ERROR:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// // Reject a request
// export async function DELETE(req: Request) {
//   try {
//     const cookieHeader = req.headers.get("cookie") || "";

//     const approverId = cookieHeader
//       .split(";")
//       .find((c) => c.trim().startsWith("userId="))
//       ?.split("=")[1]
//       ?.trim();

//     const role = cookieHeader
//       .split(";")
//       .find((c) => c.trim().startsWith("role="))
//       ?.split("=")[1]
//       ?.trim();

//     if (!approverId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     if (role !== "COORDINATOR" && role !== "RLDC_COORDINATOR") {
//       return NextResponse.json({ error: "Forbidden" }, { status: 403 });
//     }

//     const { registrationId, remarks } = await req.json();

//     if (!registrationId) {
//       return NextResponse.json({ error: "Registration ID missing" }, { status: 400 });
//     }

//     const pendingApproval = await prisma.approval.findFirst({
//       where: { userId: registrationId, status: "Pending" },
//     });

//     if (!pendingApproval) {
//       return NextResponse.json({ error: "No pending approval found" }, { status: 404 });
//     }

//     await prisma.approval.updateMany({
//       where: {
//         userId: registrationId,
//         status: "Pending",
//       },
//       data: {
//         status: "Rejected",
//         remarks: remarks || "Rejected by coordinator",
//         approverId,
//       },
//     });

//     return NextResponse.json({ message: "Request rejected successfully" });
//   } catch (error) {
//     console.error("COORDINATOR REJECT ERROR:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }

// app/api/coordinator/requests/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Fetch all users whose latest approval status is "Pending"
    const pendingApprovals = await prisma.approval.findMany({
      where: {
        status: "Pending",
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

    // Each approval maps directly to a pending request
    const pendingRequests = pendingApprovals.map((approval) => ({
      id: approval.id,
      userId: approval.userId,
      approverId: approval.approverId,
      status: approval.status,
      remarks: approval.remarks,
      createdAt: approval.createdAt.toISOString(),
      user: {
        id: approval.user.id,
        username: approval.user.username,
        userType: approval.user.userType,
        createdAt: approval.user.createdAt.toISOString(),
        profile: approval.user.profile
          ? {
              fullName: approval.user.profile.fullName,
              designation: approval.user.profile.designation,
              email: approval.user.profile.email,
              altEmail: approval.user.profile.altEmail ?? null,
              phone: approval.user.profile.phone,
              altPhone: approval.user.profile.altPhone ?? null,
            }
          : null,
        role: approval.user.role
          ? { role: approval.user.role.role }
          : null,
        entity: approval.user.entity
          ? {
              entityName: approval.user.entity.entityName,
              substation: approval.user.entity.substation,
              ownerName: approval.user.entity.ownerName,
              ownerEmail: approval.user.entity.ownerEmail,
              ownerPhone: approval.user.entity.ownerPhone,
              rldc: approval.user.entity.rldc,
            }
          : null,
        meters: approval.user.meters.map((m) => ({
          id: m.id,
          meterNo: m.meterNo,
          meterOwner: m.meterOwner,
        })),
        qcaDetails: approval.user.qcaDetails
          ? {
              licenseNumber: approval.user.qcaDetails.licenseNumber,
              managedStations: approval.user.qcaDetails.managedStations ?? null,
            }
          : null,
        associateManagers: approval.user.associateManagers.map((am) => ({
          id: am.id,
          name: am.name ?? null,
          designation: am.designation ?? null,
          email: am.email ?? null,
          phone: am.phone ?? null,
        })),
      },
    }));

    return NextResponse.json({ pendingRequests }, { status: 200 });
  } catch (error) {
    console.error("COORDINATOR REQUESTS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending requests" },
      { status: 500 }
    );
  }
}

// DELETE — reject a request
export async function DELETE(req: Request) {
  try {
    const { registrationId, remarks } = await req.json();

    if (!registrationId) {
      return NextResponse.json(
        { error: "registrationId is required" },
        { status: 400 }
      );
    }

    // Find the latest pending approval for this user
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

    await prisma.approval.update({
      where: { id: approval.id },
      data: {
        status: "CoordinatorRejected",
        remarks: remarks || "Rejected by coordinator",
      },
    });

    return NextResponse.json(
      { message: "Request rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("COORDINATOR REJECT ERROR:", error);
    return NextResponse.json(
      { error: "Failed to reject request" },
      { status: 500 }
    );
  }
}