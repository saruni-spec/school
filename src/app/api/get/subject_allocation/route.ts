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
    const records = await prisma.subject_allocation.findMany({
      where: { department: { school_id: Number(school_id) } },
      select: {
        id: true,
        assigned_date: true,
        subject_grade: {
          select: { name: true },
        },
        department: {
          select: { name: true },
        },
        teacher: {
          select: {
            department_staff: {
              select: { staff: { select: { school_code: true } } },
            },
          },
        },
        semester: { select: { start_date: true } },
        stream: {
          select: { name: true },
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
