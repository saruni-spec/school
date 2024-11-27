import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * Enhanced POST handler with robust unique checking across different models
 *
 * This route provides a dynamic, configurable approach to creating records
 * with unique constraint validation based on predefined rules.
 *
 *
 * @param request - The incoming HTTP request
 * @returns NextResponse with created record or error details
 */
export async function POST(request: Request) {
  // Parse the request body to extract model-specific data
  const body: {
    data: Record<string, unknown>;
    modelName: string;
  } = await request.json();

  // Extract the data and model name from the request body
  const data = body.data;
  const modelName = body.modelName;
  //
  try {
    // Create the record
    const record = await prisma[modelName].create({ data });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    // handle duplicate records
    console.error(`Error registering ${modelName}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log("Duplicate record", error.meta);
        return NextResponse.json(
          {
            error: `Duplicate record in ${modelName} already exists`,
            details: error.message,
          },
          { status: 500 } // Internal Server Error
        );
      }
    }

    // Differentiate between different types of errors
    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: `Error registering ${modelName}`,
          details: error.message,
        },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: `Unexpected error registering ${modelName}` },
      { status: 500 }
    );
  }
}
