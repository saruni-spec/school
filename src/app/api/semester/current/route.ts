import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Fetch the current academic year
 */
export async function GET(request: Request) {
  try {
    // Extract table name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get("school_id");

    if (!school_id) {
      return NextResponse.json(
        {
          error:
            "school_id is required to fetch records. Please provide a valid school_id",
        },
        { status: 400 } // Bad Request
      );
    }

    // Fetch all records from the specified table
    const records = await prisma.semester.findFirst({
      where: {
        academic_year: { school_id: Number(school_id), is_current: true },
        is_current: true,
      },
      select: { id: true, name: true },
    });

    return NextResponse.json(records, { status: 200 }); // OK
  } catch (error) {
    console.error("Error fetching current semester:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching current semester", details: error.message },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: "Unexpected error fetching current semester" },
      { status: 500 }
    );
  }
}
