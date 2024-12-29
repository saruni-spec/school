import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Fetch the ctimetable for a school dduring timetable creation
 */
export async function GET(request: Request) {
  try {
    // Extract table name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get("school_id");
    const semester_id = searchParams.get("semester_id");

    if (!school_id) {
      return NextResponse.json(
        {
          error:
            "school_id is required to fetch records. Please provide a valid school_id",
        },
        { status: 400 } // Bad Request
      );
    }

    const records = await prisma.time_table.findFirst({
      where: {
        school_id: Number(school_id),
        AND: { semester_id: Number(semester_id) },
      },
      select: {
        id: true,
        slot_duration: true,
        start_time: true,
        end_time: true,
        days_per_week: true,
        breaks: true,
        semester_id: true,
        school_id: true,
        slots: {
          select: {
            start_time: true,
            end_time: true,
            day_of_week: true,
            room_number: true,
            slot_assignment: {
              select: {
                stream_id: true,
                subject_allocation: {
                  select: {
                    subject_grade_id: true,
                    teacher_id: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json(records, { status: 200 }); // OK
  } catch (error) {
    console.error("Error fetching current time_table:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching current time_table", details: error.message },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: "Unexpected error fetching current time_table" },
      { status: 500 }
    );
  }
}
