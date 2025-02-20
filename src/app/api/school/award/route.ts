import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
// Award Registration Route
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, semester_id, awarded_by, awared_for, school_id, type } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Award name or type is required " },
        { status: 400 }
      );
    }

    // Check for existing similar award
    const existingAward = await prisma.award.findFirst({
      where: {
        name,
        semester_id: semester_id || undefined,
        school_id: school_id || undefined,
      },
    });

    if (existingAward) {
      return NextResponse.json(
        { error: "Similar award already exists" },
        { status: 400 }
      );
    }

    // Create award
    const newAward = await prisma.award.create({
      data: {
        name,
        semester_id: semester_id || undefined,
        awarded_by,
        awared_for,
        school_id: school_id || undefined,
        type,
      },
    });

    return NextResponse.json(newAward, { status: 201 });
  } catch (error) {
    console.error("Error registering award:", error);
    return NextResponse.json(
      { error: "Error registering award" },
      { status: 500 }
    );
  }
}
