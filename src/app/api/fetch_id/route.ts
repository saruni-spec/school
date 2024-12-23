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
    const tableName = searchParams.get("table");

    if (!tableName) {
      return NextResponse.json(
        {
          error:
            "Table name is required as a query parameter (e.g., ?table=users)",
        },
        { status: 400 } // Bad Request
      );
    }

    // Check if the table name exists in the Prisma client
    if (!prisma[tableName]) {
      return NextResponse.json(
        { error: `Invalid table name '${tableName}'` },
        { status: 400 } // Bad Request
      );
    }
    const records = await prisma[tableName].findMany({
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
