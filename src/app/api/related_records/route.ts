import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const tableName = url.searchParams.get("table");
  const schoolId = url.searchParams.get("school_id");

  if (!tableName) {
    return NextResponse.json(
      { error: "Table name is required" },
      { status: 400 }
    );
  }

  try {
    // Dynamically access the Prisma model
    if (!(tableName in prisma)) {
      throw new Error(`Invalid table name: ${tableName}`);
    }

    // Fetch related records, including optional school filtering if applicable
    const records = await prisma[tableName].findMany({
      where: schoolId ? { school_id: Number(schoolId) } : {},
    });

    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error("Error fetching related records:", error);
    return NextResponse.json(
      { error: "Failed to fetch related records", details: error.message },
      { status: 500 }
    );
  }
}