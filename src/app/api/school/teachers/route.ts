import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 *Fetch all the teachers from the school
 */
export async function GET(request: Request) {
  try {
    // Extract school_id name from the URL query parameters
    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get("school_id");

    if (!school_id) {
      return NextResponse.json(
        {
          error:
            "school_id name is required as a query parameter (e.g., ?school_id=users)",
        },
        { status: 400 } // Bad Request
      );
    }

    // Fetch all teachers from the specified school_id
    const teachers = await prisma.teacher.findMany({
      where: {
        staff: { department: { school_id: parseInt(school_id) } },
      },
      select: {
        id: true,
        staff: {
          select: {
            id: true,
            school_code: true,
            users: { select: { name: true } },
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
