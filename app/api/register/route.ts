/*import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import { Role } from "@prisma/client";

/* TYPES 
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
      console.log("=== REGISTER API HIT ===")
    console.log("Body received:", JSON.stringify(body, null, 2))

    // Test DB connection first
    console.log("Testing DB connection...")
    await prisma.$connect()
    console.log("DB connected successfully!")

    /* ===== 1. VALIDATION ===== 
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

    /* ===== 2. HASH PASSWORD ===== 
    const hashedPassword = await bcrypt.hash(body.credentials.password, 10);

    /* ===== 3. TRANSACTION ===== 
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
      // QCA Details - only create if userType is QCA and licenseNumber exists
      if (
  body.credentials.userType === "QCA" &&
  body.qcaDetails &&
  body.qcaDetails.licenseNumber &&
  body.qcaDetails.licenseNumber.trim() !== ""
) {
  await tx.qCADetails.create({
    data: {
      userId,
      licenseNumber: body.qcaDetails.licenseNumber.trim(),
      managedStations: body.qcaDetails.managedStations ?? "",
    },
  });
}

      

      // Role Assignment
      if (body.roleAssignment) {
        await tx.roleAssignment.create({
          data: {
            userId,
            role: Role.ADMIN,

          }
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
}*/

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Prisma, Role } from "@prisma/client";

/* ================= TYPES ================= */

type RequestBody = {
  sectionA: {
    userType: string;
    role: string;
  };
  sectionB: {
    username: string;
    password: string;
    confirmPassword?: string;
  };
  sectionC?: {
    fullName: string;
    designation: string;
    email: string;
    altEmail?: string;
    phone: string;
    altPhone?: string;
  };
  sectionD?: {
    entityName: string;
    substation: string;
    ownerName: string;
    ownerEmail: string;
    ownerPhone: string;
    rldc?: string;
  };
  sectionE?: {
    name?: string;
    designation?: string;
    email?: string;
    phone?: string;
  }[];
  sectionF?: {
    meterNo: string;
    meterOwner?: string;
  }[];
  sectionG?: {
    licenseNumber: string;
    managedStations?: string;
  };
};

export async function POST(req: Request) {
  try {
    const body: RequestBody = await req.json();

    console.log("=== REGISTER API HIT ===");
    console.log(JSON.stringify(body, null, 2));

    await prisma.$connect();

    /* ================= SECTION A ================= */
    const { userType, role } = body.sectionA || {};

    if (!userType || !role) {
      return NextResponse.json(
        { error: "User Type & Role required (Section A)" },
        { status: 400 }
      );
    }


    const roleValue = role as Role;
    console.log("Role received:", roleValue);
console.log("Valid roles:", Object.values(Role));

    if (!Object.values(Role).includes(roleValue)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 }
      );
    }

    /* ================= SECTION B ================= */
    const { username, password, confirmPassword } =
      body.sectionB || {};

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username & Password required (Section B)" },
        { status: 400 }
      );
    }

    if (confirmPassword && password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    /* ================= TRANSACTION ================= */

    const result = await prisma.$transaction(async (tx) => {
      /* ===== CREATE USER ===== */
      const user = await tx.user.create({
        data: {
          username,
          password: hashedPassword,
          userType,
        },
      });

      const userId = user.id;

      /* ===== ROLE ASSIGNMENT ===== */
      await tx.roleAssignment.create({
        data: {
          userId,
          role: roleValue,
        },
      });

      /* ================= SECTION C ================= */
      if (body.sectionC) {
        await tx.accountManagerProfile.create({
          data: {
            userId,
            ...body.sectionC,
          },
        });
      }

      /* ================= SECTION D ================= */
if (body.sectionD) {
  if (body.sectionA.userType === "RLDC") {
    // RLDC only needs rldc field
    await tx.entity.create({
      data: {
        userId,
        entityName: "",
        substation: "",
        ownerName: "GRID India",
        ownerEmail: "",
        ownerPhone: "",
        rldc: body.sectionD.rldc ?? "",
      },
    });
  } else {
    // All other user types
    await tx.entity.create({
      data: {
        userId,
        entityName: body.sectionD.entityName ?? "",
        substation: body.sectionD.substation ?? "",
        ownerName: "GRID India",
        ownerEmail: body.sectionD.ownerEmail ?? "",
        ownerPhone: body.sectionD.ownerPhone ?? "",
        rldc: "",
      },
    });
  }
}

      /* ================= SECTION E ================= */
      if (body.sectionE?.length) {
        await tx.associateManager.createMany({
          data: body.sectionE.map((am) => ({
            userId,
            name: am.name ?? "",
            designation: am.designation ?? "",
            email: am.email ?? "",
            phone: am.phone ?? "",
          })),
        });
      }

      /* ================= SECTION F (METERS) ================= */
      if (body.sectionF?.length) {
        const validMeters = body.sectionF.filter(
          (m) => m.meterNo.trim() !== ""
        );

        if (validMeters.length) {
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

      /* ================= SECTION G (QCA ONLY) ================= */
      if (userType === "QCA") {
        if (!body.sectionG?.licenseNumber) {
          throw new Error(
            "License Number required for QCA (Section G)"
          );
        }

        await tx.qCADetails.create({
          data: {
            userId,
            licenseNumber: body.sectionG.licenseNumber.trim(),
            managedStations:
              body.sectionG.managedStations ?? "",
          },
        });
      }

      /* ===== APPROVAL (NO APPROVER INPUT) ===== */
      await tx.approval.create({
        data: {
          userId,
          approverId: "PENDING",
          status: "Pending",
          remarks: "",
        },
      });

      return user;
    });

    return NextResponse.json(
      {
        message: "Registration successful",
        userId: result.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration Error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}