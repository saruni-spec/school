import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//
// Get the list of schools (name and id) for the dropdown
export async function GET() {
  try {
    const records = await prisma.school.findMany({
      select: {
        id: true,
        name: true,
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
