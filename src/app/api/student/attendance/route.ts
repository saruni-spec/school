import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 *Get the slots for the teacher
 */
export async function GET(request: Request) {
  try {
    // Extract users_id name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const users_id = searchParams.get("users_id");

    if (!users_id) {
      return NextResponse.json(
        {
          error:
            "users_id name is required as a query parameter (e.g., ?users_id=users)",
        },
        { status: 400 } // Bad Request
      );
    }

    // Fetch all student_schedule from the specified users_id
    const attendance = await prisma.attendance.findMany({
      where: { users_id: Number(users_id) },
      select: {
        staff_id: true,
        taken_on: true,
        status: true,
        reason_for_absence: true,
        notified_on: true,
        to_miss_on: true,
        up_to: true,
        staff: { select: { school_code: true } },
      },
    });

    return NextResponse.json(attendance, { status: 200 }); // OK
  } catch (error) {
    console.error("Error fetching student_schedule:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching student_schedule", details: error.message },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: "Unexpected error fetching student_schedule" },
      { status: 500 }
    );
  }
}
