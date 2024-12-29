import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 *Get the slots for the teacher
 */
export async function GET(request: Request) {
  try {
    // Extract teacher_id name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get("school_id");
    const stream_id = searchParams.get("stream_id");

    if (!school_id || !stream_id) {
      return NextResponse.json(
        {
          error:
            "teacher_id name is required as a query parameter (e.g., ?teacher_id=users)",
        },
        { status: 400 } // Bad Request
      );
    }

    // Fetch all student_schedule from the specified teacher_id
    const student_schedule = await prisma.slot_assignment.findMany({
      where: {
        slot: { time_table: { school_id: Number(school_id) } },
        AND: [{ subject_allocation: { stream_id: Number(stream_id) } }],
      },
      select: {
        id: true,
        slot: {
          select: {
            id: true,
            name: true,
            start_time: true,
            end_time: true,
            day_of_week: true,
            room_number: true,
          },
        },
        subject_allocation: {
          select: {
            stream_id: true,
            subject_grade: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(student_schedule, { status: 200 }); // OK
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
