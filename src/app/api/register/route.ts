import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { record } from "@/app/types/types";
import { hash } from "bcrypt";
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
    data: record;
    model_name: string;
  } = await request.json();

  // Extract the data and model name from the request body
  const data = body.data;
  const model_name = body.model_name;

  //check if the model is users to hash the password
  if (model_name === "users") {
    data.password = await hash(data.password as string, 10);
  }
  try {
    // Create the record
    const record = await prisma[model_name].create({ data });
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    // handle duplicate records
    console.error(`Error registering ${model_name}:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        console.log("Duplicate record", error.meta);
        return NextResponse.json(
          {
            error: `Duplicate record in ${model_name} already exists`,
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
          error: `Error registering ${model_name}`,
          details: error.message,
        },
        { status: 500 } // Internal Server Error
      );
    }

    // Fallback for unexpected error types
    return NextResponse.json(
      { error: `Unexpected error registering ${model_name}` },
      { status: 500 }
    );
  }
}
