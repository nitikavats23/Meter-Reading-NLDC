import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.approval.findMany({
    where: {
      status: "Pending",
    },
    include: {
      user: {
        include: {
          profile: true,
          entity: true,
          meters: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(data);
}