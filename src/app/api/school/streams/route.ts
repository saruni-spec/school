import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 *Fetch all the streams from the school
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

    // Fetch all streams from the specified school_id
    const streams = await prisma.stream.findMany({
      where: {
        school_id: parseInt(school_id),
      },
      select: {
        id: true,
        name: true,
        grade_level: { select: { level: true } },
      },
    });

    return NextResponse.json(streams, { status: 200 }); // OK
  } catch (error) {
    console.error("Error fetching streams:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching streams", details: error.message },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: "Unexpected error fetching streams" },
      { status: 500 }
    );
  }
}
