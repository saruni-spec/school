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
    const users_id = searchParams.get("users_id");

    if (!users_id) {
      return NextResponse.json(
        {
          error:
            "users_id is required to fetch records. Please provide a valid users_id",
        },
        { status: 400 } // Bad Request
      );
    }

    const records = await prisma.users.findUnique({
      where: { id: Number(users_id) },
      include: {
        admin: true,
        staff: {
          include: {
            department: true,
            teacher: true,
            school_leader: { include: { academic_year: true } },
          },
        },
        student: true,
        parent: true,
        school: true,
        role: true,
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
