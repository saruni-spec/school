import { BaseValue } from "@/app/types/types";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * Dynamic handler to fetch records from any table with flexible filtering
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {NextResponse} - JSON response with data or error details
 */
export async function GET(request: Request) {
  try {
    // Extract URL parameters
    const { searchParams } = new URL(request.url);

    // Require table name
    const tableName = searchParams.get("table_name");
    if (!tableName) {
      return NextResponse.json(
        { error: "Table name is required (e.g., ?table_name=users)" },
        { status: 400 }
      );
    }

    // Check if the table name exists in the Prisma client
    if (!prisma[tableName]) {
      return NextResponse.json(
        { error: `Invalid table name '${tableName}'` },
        { status: 400 }
      );
    }

    // Prepare dynamic where clause
    const whereClause: Record<string, BaseValue> = {};

    for (const [key, value] of searchParams.entries()) {
      if (key !== "table_name") {
        let processedValue: string | number | boolean = value;

        // Check if the field specifically needs to be a number
        const shouldBeNumber = [
          "id",
          "school_id",
          "academic_year_id",
          "semester_id",
          "users_id",
          "facility_id",
          "school_facility_id",
          "class_id",
          "subject_id",
          "teacher_id",
          "student_id",
          "parent_id",
          "staff_id",
          "role_id",
          "department_id",
          "subject_id",
        ].includes(key);

        if (shouldBeNumber && /^\d+$/.test(value)) {
          processedValue = parseInt(value, 10);
        } else if (shouldBeNumber && /^\d+\.\d+$/.test(value)) {
          processedValue = parseFloat(value);
        } else if (value.toLowerCase() === "true") {
          processedValue = true;
        } else if (value.toLowerCase() === "false") {
          processedValue = false;
        }

        whereClause[key] = processedValue;
      }
    }

    // Fetch records with dynamic filtering
    const records = await prisma[tableName].findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching records:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching records", details: error.message },
        { status: 500 }
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: "Unexpected error fetching records" },
      { status: 500 }
    );
  }
}
