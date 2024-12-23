import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
/**
 * Fetch all records from the `department_staff` table.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const school_id = searchParams.get("school_id");

    if (!school_id) {
      return NextResponse.json(
        {
          error:
            "school_id is required to fetch records. Please provide a valid school_id",
        },
        { status: 400 }
      );
    }

    const records = await prisma.department_staff.findMany({
      where: {
        department: {
          school_id: Number(school_id),
        },
      },
      select: {
        id: true,
        staff: {
          select: { school_code: true },
        },
        employment_status: true,
        join_date: true,
        current_role: true,
        department: {
          select: { name: true },
        },
      },
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching department_staff records:", error);
    return NextResponse.json(
      { error: "Error fetching records", details: error.message },
      { status: 500 }
    );
  }
}
