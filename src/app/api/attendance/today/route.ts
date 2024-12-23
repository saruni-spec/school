import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Get the attendance records for today
 */
export async function GET(request: Request) {
  try {
    // Extract table name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const class_progression_id = searchParams.get("class_progression_id");

    if (!date || !class_progression_id) {
      return NextResponse.json(
        {
          error:
            "date and class_progression_id are required. Please provide valid inputs.",
        },
        { status: 400 } // Bad Request
      );
    }

    // Parse the date and calculate start and end of the day
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
    const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));

    // Fetch all records from the specified table
    const records = await prisma.attendance.findMany({
      where: {
        taken_on: {
          gte: startOfDay, // Greater than or equal to start of the day
          lte: endOfDay, // Less than or equal to end of the day
        },
        class_progression_id: Number(class_progression_id),
      },
      select: {
        users_id: true,
        status: true,
        class_progression_id: true,
        staff_id: true,
        taken_on: true,
      },
    });

    return NextResponse.json(records, { status: 200 }); // OK
  } catch (error) {
    console.error("Error fetching students:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching students", details: error.message },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: "Unexpected error fetching students" },
      { status: 500 }
    );
  }
}
