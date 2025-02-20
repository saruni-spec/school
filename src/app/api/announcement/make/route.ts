import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Announcement Registration Route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { announcement, date_for, valid_upto, scope } = body;

    // Validate required fields
    if (!date_for || !valid_upto || !scope) {
      return NextResponse.json(
        { error: "Date for, valid up to, and scope are required" },
        { status: 400 }
      );
    }

    // Validate dates
    const dateFor = new Date(date_for);
    const validUpto = new Date(valid_upto);
    if (dateFor > validUpto) {
      return NextResponse.json(
        { error: "Date for must be before or equal to valid up to" },
        { status: 400 }
      );
    }

    // Create announcement
    const newAnnouncement = await prisma.announcement.create({
      data: {
        announcement,

        date_for: dateFor,
        valid_upto: validUpto,
        scope,
      },
    });

    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error("Error registering announcement:", error);
    return NextResponse.json(
      { error: "Error registering announcement" },
      { status: 500 }
    );
  }
}
