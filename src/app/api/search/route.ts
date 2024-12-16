import { record } from "@/app/types/types";
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
    table_name: string;
    search_term?: string;
    search_field: string;
    display_fields: string[];
    relation?: { field: string; item: string };
  } = await request.json();

  const search_term = body.search_term;
  const search_field = body.search_field;
  const model_name = body.table_name;
  const display_fields = body.display_fields;
  const related_field = body.relation?.field;
  const related_item = body.relation?.item;

  try {
    // Check if the table name exists in the Prisma client
    if (!prisma[model_name]) {
      return NextResponse.json(
        { error: `Invalid table name '${model_name}'` },
        { status: 400 } // Bad Request
      );
    }
    const record = await prisma[model_name].findMany({
      //search for the search term in the search field if search term is provided
      where: search_term
        ? {
            [search_field]: {
              contains: search_term,
              mode: "insensitive",
            },
          }
        : undefined,
      select: {
        [`id`]: true,
        // each field in the display_fields array
        ...Object.fromEntries(display_fields.map((field) => [field, true])),
        search_field: true,
        [related_field]: related_field
          ? { select: { [related_item]: true } }
          : undefined,
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
