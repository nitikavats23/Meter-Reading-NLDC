import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/utils/hash";
import { cookies } from "next/headers";

const RLDC_REGIONS = ["NRLDC", "SRLDC", "ERLDC", "WRLDC", "NERLDC"] as const;
type RLDCRegion = (typeof RLDC_REGIONS)[number];

// ── Auth Guard ────────────────────────────────────────────────────────────────
async function verifySuperAdmin() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("userId")?.value;
  const role   = cookieStore.get("role")?.value;

  if (!userId || role !== "SUPER_ADMIN") return null;
  return userId;
}

// ── GET — fetch all RLDC admins ───────────────────────────────────────────────
export async function GET() {
  try {
    const adminId = await verifySuperAdmin();
    if (!adminId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const rldcAdmins = await prisma.user.findMany({
      where: {
        role: { role: "RLDC_ADMIN" },
      },
      include: {
        profile: true,
        role:    true,
        entity:  true,
        approvals: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ success: true, data: rldcAdmins });
  } catch (error) {
    console.error("GET RLDC ADMINS ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ── POST — create an RLDC admin ───────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const superAdminId = await verifySuperAdmin();
    if (!superAdminId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { username, password, fullName, email, phone, designation, region } =
      await req.json();

    // Validation
    if (!username || !password || !fullName || !email || !phone || !region) {
      return NextResponse.json(
        { message: "All required fields must be filled" },
        { status: 400 }
      );
    }

    if (!RLDC_REGIONS.includes(region as RLDCRegion)) {
      return NextResponse.json(
        { message: "Invalid region. Must be one of: " + RLDC_REGIONS.join(", ") },
        { status: 400 }
      );
    }

    // Check max 5 RLDC admins
    const existingCount = await prisma.user.count({
      where: { role: { role: "RLDC_ADMIN" } },
    });

    if (existingCount >= 5) {
      return NextResponse.json(
        { message: "Maximum of 5 RLDC Admins already created" },
        { status: 400 }
      );
    }

    // Check region already assigned
    const regionTaken = await prisma.entity.findFirst({
      where: { rldc: region, user: { role: { role: "RLDC_ADMIN" } } },
    });

    if (regionTaken) {
      return NextResponse.json(
        { message: `${region} already has an admin assigned` },
        { status: 400 }
      );
    }

    // Check username / email uniqueness
    const [usernameTaken, emailTaken] = await Promise.all([
      prisma.user.findUnique({ where: { username } }),
      prisma.accountManagerProfile.findUnique({ where: { email } }),
    ]);

    if (usernameTaken) {
      return NextResponse.json({ message: "Username already taken" }, { status: 400 });
    }
    if (emailTaken) {
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const hashedPassword = await hashPassword(password);

    // Create user with all relations
    const newAdmin = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        userType: "RLDC_ADMIN",

        profile: {
          create: {
            fullName,
            designation: designation || "RLDC Administrator",
            email,
            phone,
          },
        },

        role: {
          create: {
            role:       "RLDC_ADMIN",
            approverId: superAdminId,
          },
        },

        entity: {
          create: {
            entityName: `${region} Administration`,
            substation: region,
            ownerName:  "GRID India",
            ownerEmail: email,
            ownerPhone: phone,
            rldc:       region,
          },
        },

        approvals: {
          create: {
            status:    "Activated",
            approverId: superAdminId,
            remarks:   `Created by Super Admin — ${region} assigned`,
          },
        },
      },
      include: {
        profile: true,
        role:    true,
        entity:  true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `RLDC Admin for ${region} created successfully`,
        data:    newAdmin,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE RLDC ADMIN ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ── DELETE — remove an RLDC admin ─────────────────────────────────────────────
export async function DELETE(req: Request) {
  try {
    const superAdminId = await verifySuperAdmin();
    if (!superAdminId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "userId is required" }, { status: 400 });
    }

    await prisma.user.delete({ where: { id: userId } });

    return NextResponse.json({ success: true, message: "RLDC Admin deleted" });
  } catch (error) {
    console.error("DELETE RLDC ADMIN ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}