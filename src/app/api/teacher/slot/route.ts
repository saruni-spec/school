import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 *Get the slots for the teacher
 */
export async function GET(request: Request) {
  try {
    // Extract teacher_id name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const teacher_id = searchParams.get("teacher_id");

    if (!teacher_id) {
      return NextResponse.json(
        {
          error:
            "teacher_id name is required as a query parameter (e.g., ?teacher_id=users)",
        },
        { status: 400 } // Bad Request
      );
    }

    // Fetch all teachers from the specified teacher_id
    const teachers = await prisma.slot_assignment.findMany({
      where: { teacher_id: parseInt(teacher_id) },
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
      },
    });

    return NextResponse.json(teachers, { status: 200 }); // OK
  } catch (error) {
    console.error("Error fetching teachers:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching teachers", details: error.message },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: "Unexpected error fetching teachers" },
      { status: 500 }
    );
  }
}
