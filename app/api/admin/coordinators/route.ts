// app/api/admin/coordinators/route.ts
//
// POST — Create a new RLDC Coordinator account.
//
// REGION RESTRICTION:
//   The coordinator's region (rldc field on Entity) is NEVER taken from the
//   request body. It is always read from the requesting admin's own Entity row
//   in the DB. An NRLDC admin can only ever create an NRLDC coordinator,
//   even if the payload is tampered with.
//
// Body: { adminId, fullName, username, password, email, phone, designation?, altEmail?, altPhone? }
//
// Models used (from actual schema):
//   User                  — username, password, userType
//   AccountManagerProfile — fullName, designation, email, altEmail, phone, altPhone
//   Entity                — rldc, entityName, substation, ownerName, ownerEmail, ownerPhone
//   RoleAssignment        — role (RLDC_COORDINATOR)
//   Approval              — status "Pending"

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      adminId:      string;
      fullName:     string;
      username:     string;
      password:     string;
      email:        string;
      phone:        string;
      designation?: string;
      altEmail?:    string;
      altPhone?:    string;
    };
    

    const {
      adminId,
      fullName,
      username,
      password,
      email,
      phone,
      designation,
      altEmail,
      altPhone,
    } = body;

    // ── Validate required fields ─────────────────────────────────────────────
    if (!adminId || !fullName || !username || !password || !email || !phone) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // ── Look up admin — region comes ONLY from their Entity row ──────────────
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
      include: {
        entity: true,       // entity.rldc = "NRLDC" / "SRLDC" etc.
        role:   true,       // role.role must be RLDC_ADMIN
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { message: "Admin not found." },
        { status: 403 }
      );
    }

    if (adminUser.role?.role !== "RLDC_ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized: only RLDC Admins can create coordinators." },
        { status: 403 }
      );
    }

    const adminRegion = adminUser.entity?.rldc;
    //const adminRegion = adminUser.entity?.rldc || "NRLDC";

console.log("BODY:", body);
console.log("ADMIN USER:", adminUser);
console.log("ADMIN REGION:", adminRegion);
    if (!adminRegion) {
      return NextResponse.json(
        { message: "Admin has no region (rldc) assigned on their Entity." },
        { status: 403 }
      );
    }

    // ── Duplicate check — username and email must both be unique ─────────────
    const [existingUsername, existingEmail] = await Promise.all([
      prisma.user.findUnique({ where: { username } }),
      prisma.accountManagerProfile.findUnique({ where: { email } }),
    ]);

    if (existingUsername) {
      return NextResponse.json(
        { message: "Username is already taken." },
        { status: 409 }
      );
    }
    if (existingEmail) {
      return NextResponse.json(
        { message: "Email is already registered." },
        { status: 409 }
      );
    }

    // ── Hash password ────────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Create coordinator in one transaction ────────────────────────────────
    // Only fields that actually exist on each model are passed.
    // AccountManagerProfile: fullName, designation, email, altEmail, phone, altPhone
    // Entity:                rldc, entityName, substation, ownerName, ownerEmail, ownerPhone
    // RoleAssignment:        role (RLDC_COORDINATOR enum value)
    // Approval:              status "Pending"
    const coordinator = await prisma.user.create({
      data: {
        username,
        password:   hashedPassword,
        userType:   "RLDC_COORDINATOR",

        profile: {
          create: {
            fullName,
            designation: designation ?? "RLDC Coordinator",
            email,
            altEmail:    altEmail  ?? null,
            phone,
            altPhone:    altPhone  ?? null,
          },
        },

        entity: {
          create: {
            // Region locked to admin's own region — not from request body
            rldc:        adminRegion,
            entityName:  `${adminRegion} Coordinator`,
            substation:  "",
            ownerName:   "GRID India",
            ownerEmail:  email,
            ownerPhone:  phone,
          },
        },

        role: {
          create: {
            role: "RLDC_COORDINATOR",
          },
        },

        approvals: {
          create: {
            status: "Pending",
          },
        },
      },
      include: {
        profile: true,
        entity:  true,
        role:    true,
      },
    });

    // TODO: send welcome email with temp password
    // await sendWelcomeEmail({ to: email, name: fullName, tempPassword: password, region: adminRegion });

    return NextResponse.json(
      {
        message: `Coordinator created successfully under ${adminRegion}.`,
        data: {
          id:       coordinator.id,
          username: coordinator.username,
          fullName: coordinator.profile?.fullName,
          email:    coordinator.profile?.email,
          region:   adminRegion,
        },
      },
      { status: 201 }
    );

  // } catch (error) {
  //   console.error("[POST /api/admin/coordinators]", error);
  //   return NextResponse.json(
  //     { message: "Internal server error." },
  //     { status: 500 }
  //   );
  // }
  }catch (error: unknown) {

  console.error("FULL ERROR:", error);

  return NextResponse.json(
    {
      message:
        error instanceof Error
          ? error.message
          : "Internal server error.",
    },
    {
      status: 500,
    }
  );
}
}