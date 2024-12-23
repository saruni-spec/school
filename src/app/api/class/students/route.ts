import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Fetch all students in a class
 */
export async function GET(request: Request) {
  try {
    // Extract table name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const class_progression_id = searchParams.get("class_progressionn_id");

    if (!class_progression_id) {
      return NextResponse.json(
        {
          error:
            "class_progressionn_id is required to fetch records. Please provide a valid class_progressionn_id",
        },
        { status: 400 } // Bad Request
      );
    }

    // Fetch all records from the specified table
    const records = await prisma.student_class.findMany({
      where: { class_progression_id: Number(class_progression_id) },
      select: {
        id: true,
        student: {
          select: {
            student_code: true,
            users: { select: { name: true, id: true } },
          },
        },
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
