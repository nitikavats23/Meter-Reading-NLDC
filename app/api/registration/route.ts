import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { fullName, designation, email, contact } = body;

    if (!fullName || !designation || !email || !contact) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    console.log("Received from frontend:", body);

    return NextResponse.json({
      message: "Data saved successfully",
      data: body,
    });

  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}