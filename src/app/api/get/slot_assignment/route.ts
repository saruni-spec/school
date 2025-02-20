import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Dynamic handler to fetch all records from any table
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {NextResponse} - JSON response with data or error details
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
    const records = await prisma.slot_assignment.findMany({
      where: { stream: { school_id: Number(school_id) } },
      select: {
        id: true,
        slot: {
          select: { day_of_week: true, start_time: true, end_time: true },
        },
        stream: { select: { name: true } },
        subject_allocation: {
          select: {
            subject_grade: { select: { name: true } },
            teacher: { select: { staff: { select: { school_code: true } } } },
          },
        },
      },
    });

    return NextResponse.json(records, { status: 200 }); // OK
  } catch (error) {
    console.error("Error fetching records:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching records", details: error.message },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: "Unexpected error fetching records" },
      { status: 500 }
    );
  }
}
