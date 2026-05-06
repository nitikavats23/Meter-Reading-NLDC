import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const pendingRegistrations = await prisma.user.findMany({
      where: {
        approvals: {
          some: {
            status: "Pending"
          }
        }
      },
      include: {
        profile: true, 
        approvals: {
          where: { status: "Pending" }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

   // Data ko clean karke bhej rahe hain
const formattedData = pendingRegistrations.map((user: any) => {
  return {
    id: user.id,
    // Pehle profile ka fullName check karega, fir profile ki email, fir main user ki email
    name: user.profile?.fullName || user.profile?.email || user.email || "Unknown User",
    type: user.userType || "N/A",
    // Safe date formatting
    timeAgo: user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-GB') : "Recently",
    status: "Pending"
  };
});

    return NextResponse.json(formattedData);
  } catch (error: any) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Data fetch fail ho gaya", details: error.message }, { status: 500 });
  }
}