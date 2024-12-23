import prisma from "@/lib/prisma";
import { domain_specific_roles } from "@prisma/client";
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
    const staff_id = searchParams.get("staff_id");
    const department_id = searchParams.get("department_id");
    const role = searchParams.get("role");

    console.log(staff_id, department_id, role);

    if (!staff_id || !department_id) {
      return NextResponse.json(
        {
          error: "Staff is required as a query parameter (e.g., ?staff_id=x)",
        },
        { status: 400 } // Bad Request
      );
    }

    const records = await prisma.staff.update({
      where: { id: Number(staff_id) },
      data: {
        department_id: Number(department_id),
        domain_role: role as domain_specific_roles,
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
