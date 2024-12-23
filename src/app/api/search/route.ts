import prisma from "@/lib/prisma";
import { console } from "inspector";
import { NextResponse } from "next/server";

/**
 * Searches for records in the database with partial name matching
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {NextResponse} - JSON response with data or error details
 */
export async function POST(request: Request) {
  // Parse the request body to extract model-specific data
  const body: {
    user_name: string;
    display_fields: string[];
  } = await request.json();

  const user_name = body.user_name;

  try {
    // Perform partial matching using case-insensitive search
    const record = await prisma.users.findMany({
      where: {
        name: {
          contains: user_name,
          mode: "insensitive", // Case-insensitive search
        },
      },
      select: {
        id: true,
        name: true,
        school_id: true,
        id_code: true,
        student: {
          select: {
            student_code: true,
            id: true,
            student_class: {
              select: {
                class_progression: {
                  where: { is_current: true },
                  select: { name: true },
                },
              },
            },
          },
        },
        // Include each field in the display_fields array
      },
      // Limit results to prevent overwhelming responses
      take: 10,
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching records", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Unexpected error fetching records" },
      { status: 500 }
    );
  }
}
