import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

/* TYPES */
type RequestBody = {
  credentials: {
    userType: string;
    username: string;
    password: string;
  };
  accountManager?: {
    fullName: string;
    designation: string;
    email: string;
    altEmail?: string;
    phone: string;
    altPhone?: string;
  };
  entity?: {
    entityName: string;
    substation: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
  };
  associateManagers?: {
    name?: string;
    designation?: string;
    email?: string;
    phone?: string;
  }[];
  meters?: {
    meterNo: string;
    meterOwner?: string;
  }[];
  qcaDetails?: {
    licenseNumber: string;
    managedStations?: string;
  };
  roleAssignment?: {
    role: string;
    approverId: string;
  };
};

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    /* ===== VALIDATION ===== */
    if (
      !body.credentials.username ||
      !body.credentials.password ||
      !body.credentials.userType
    ) {
      return NextResponse.json(
        { error: "Missing required credentials" },
        { status: 400 }
      );
    }

    /* ===== HASH PASSWORD ===== */
    const hashedPassword = await bcrypt.hash(
      body.credentials.password,
      10
    );

    const result = await prisma.$transaction(async (tx) => {

      /* ===== 1. USER ===== */
      const user = await tx.user.create({
        data: {
          userType: body.credentials.userType,
          username: body.credentials.username,
          password: hashedPassword,
        },
      });

      const userId = user.id;

      /* ===== 2. ACCOUNT MANAGER ===== */
      if (body.accountManager) {
        await tx.accountManagerProfile.create({
          data: { userId, ...body.accountManager },
        });
      }

      /* ===== 3. ENTITY ===== */
      if (body.entity) {
        await tx.entity.create({
          data: { userId, ...body.entity },
        });
      }

      /* ===== 4. ASSOCIATE MANAGERS ===== */
      if (body.associateManagers?.length) {
        await tx.associateManager.createMany({
          data: body.associateManagers.map((am) => ({
            userId,
            name: am.name ?? "",
            designation: am.designation ?? "",
            email: am.email ?? "",
            phone: am.phone ?? "",
          })),
        });
      }

      /* ===== 5. METERS ===== */
     if (body.meters?.length) {
  await tx.meter.createMany({
    data: body.meters
      .filter((m) => m.meterNo && m.meterNo.trim() !== "") // 🔥 FIX
      .map((m) => ({
        userId,
        meterNo: m.meterNo.trim(),
        meterOwner: m.meterOwner ?? "",
      })),
    skipDuplicates: true,
  });
}

      /* ===== 6. QCA DETAILS ===== */
  if (body.qcaDetails) {
  await tx.qCADetails.create({
    data: { userId, ...body.qcaDetails },
  });
}

      /* ===== 7. ROLE ASSIGNMENT ===== */
      if (body.roleAssignment) {
        await tx.roleAssignment.create({
          data: {
            userId,
            role: body.roleAssignment.role,
            approverId: body.roleAssignment.approverId,
          },
        });
      }

      /* ===== 8. APPROVAL ===== */
      await tx.approval.create({
        data: {
          userId,
          approverId:
            body.roleAssignment?.approverId ||
            "COORDINATOR_ID",
          status: "Pending",
          remarks: "",
        },
      });

      return user;
    });

    return NextResponse.json({
      message: "Registration submitted for approval",
      user: result,
    });

  } catch (error: unknown) {
    /* ===== HANDLE UNIQUE ERROR ===== */
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong",
      },
      { status: 500 }
    );
  }
}