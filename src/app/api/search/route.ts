import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Will be used to search for records in the database
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
  const display_fields = body.display_fields;

  try {
    // Check if the table name exists in the Prisma client

    const record = await prisma.users.findMany({
      //search for the search term in the search field if search term is provided
      where: {
        name: user_name,
      },
      select: {
        id: true,
        name: true,
        student: {
          select: { student_class: { select: { admission_number: true } } },
        },
        staff: {
          select: { department_staff: { select: { staff_code: true } } },
        },
        // each field in the display_fields array
        ...Object.fromEntries(display_fields.map((field) => [field, true])),
      },
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
