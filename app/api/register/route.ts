import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

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

    /* ===== 1. VALIDATION ===== */
    if (
      !body.credentials?.username ||
      !body.credentials?.password ||
      !body.credentials?.userType
    ) {
      return NextResponse.json(
        { error: "Missing required credentials" },
        { status: 400 }
      );
    }

    /* ===== 2. HASH PASSWORD ===== */
    const hashedPassword = await bcrypt.hash(body.credentials.password, 10);

    /* ===== 3. TRANSACTION ===== */
    const result = await prisma.$transaction(async (tx) => {
      // Create User
      const user = await tx.user.create({
        data: {
          userType: body.credentials.userType,
          username: body.credentials.username,
          password: hashedPassword,
        },
      });

      const userId = user.id;

      // Account Manager Profile
      if (body.accountManager) {
        await tx.accountManagerProfile.create({
          data: { userId, ...body.accountManager },
        });
      }

      // Entity
      if (body.entity) {
        await tx.entity.create({
          data: { userId, ...body.entity },
        });
      }

      // Associate Managers
      if (body.associateManagers && body.associateManagers.length > 0) {
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

      // Meters
      if (body.meters && body.meters.length > 0) {
        const validMeters = body.meters.filter(
          (m) => m.meterNo && m.meterNo.trim() !== ""
        );
        if (validMeters.length > 0) {
          await tx.meter.createMany({
            data: validMeters.map((m) => ({
              userId,
              meterNo: m.meterNo.trim(),
              meterOwner: m.meterOwner ?? "",
            })),
            skipDuplicates: true,
          });
        }
      }

      // QCA Details
      if (body.qcaDetails) {
        await tx.qCADetails.create({
          data: { userId, ...body.qcaDetails },
        });
      }

      // Role Assignment
      if (body.roleAssignment) {
        await tx.roleAssignment.create({
          data: {
            userId,
            role: body.roleAssignment.role,
            approverId: body.roleAssignment.approverId,
          },
        });
      }

      // Approval — always created
      await tx.approval.create({
        data: {
          userId,
          approverId: body.roleAssignment?.approverId ?? "PENDING_COORDINATOR",
          status: "Pending",
          remarks: "",
        },
      });

      return user;
    });

    return NextResponse.json(
      { message: "Registration successful", userId: result.id },
      { status: 201 }
    );

  } catch (error: unknown) {
    console.error("Registration Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Username or email already exists" },
          { status: 409 }
        );
      }
    }

    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Database connection failed. Check your DATABASE_URL in .env" },
        { status: 503 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}