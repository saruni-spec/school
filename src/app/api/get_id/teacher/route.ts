import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/get_id/teacher
 * get the id of the staff record with the given users_id
 */
export async function GET(request: Request) {
  try {
    // Extract table name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const users_id = searchParams.get("users_id");

    if (!users_id) {
      return NextResponse.json(
        {
          error: "User Id is required as a query parameter (e.g., ?users_id=x)",
        },
        { status: 400 } // Bad Request
      );
    }

    const records = await prisma.staff.findUnique({
      where: { users_id: Number(users_id) },
      select: {
        id: true,
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
