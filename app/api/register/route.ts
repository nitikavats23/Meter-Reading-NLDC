import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

/* ================= TYPES ================= */

type Role = "SUPER_ADMIN" | "ADMIN" | "COORDINATOR" | "RLDC_ADMIN" | "RLDC_COORDINATOR" | "RLDC_USER" | "RLDC_ANALYST" | "USER";

const VALID_ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "COORDINATOR", "RLDC_ADMIN", "RLDC_COORDINATOR", "RLDC_USER", "RLDC_ANALYST", "USER"];

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

    if (!VALID_ROLES.includes(roleValue)) {
      return NextResponse.json(
        { error: "Invalid role provided" },
        { status: 400 }
      );
    }

    /* ================= SECTION B ================= */
    const { username, password, confirmPassword } = body.sectionB || {};

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
          await tx.entity.create({
            data: {
              userId,
              entityName: body.sectionD.entityName ?? "",
              substation: body.sectionD.substation ?? "",
              ownerName: "GRID India",
              ownerEmail: body.sectionD.ownerEmail ?? "",
              ownerPhone: body.sectionD.ownerPhone ?? "",
              rldc: body.sectionD.rldc ?? "",
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
          throw new Error("License Number required for QCA (Section G)");
        }

        await tx.qCADetails.create({
          data: {
            userId,
            licenseNumber: body.sectionG.licenseNumber.trim(),
            managedStations: body.sectionG.managedStations ?? "",
          },
        });
      }

      /* ===== APPROVAL ===== */
      await tx.approval.create({
        data: {
          userId,
          approverId: null,
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

    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal Server Error",
      },
      { status: 500 }
    );
  }
}