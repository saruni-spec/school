import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";

// Define a more strict type for the request body
interface RegisterRequest {
  data: Record<string, unknown>;
  model_name: string;
}

// Custom error for validation failures
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Enhanced POST handler with robust unique checking and type safety
 *
 * Provides a secure approach to creating records with:
 * - Input validation
 * - Model-specific processing
 * - Comprehensive error handling
 *
 * @param request - The incoming HTTP request
 * @returns NextResponse with created record or detailed error
 */
export async function POST(request: Request) {
  // Parse request body
  const body: RegisterRequest = await request.json();
  try {
    // Validate data presence
    if (!body.data || typeof body.data !== "object") {
      throw new ValidationError("Invalid data payload");
    }

    // Special handling for user creation (password hashing)
    if (body.model_name === "users" && typeof body.data.password === "string") {
      body.data.password = await hash(body.data.password, 10);
    }

    // Type-safe dynamic model creation
    const record = await prisma[body.model_name].create({
      data: body.data,
    });

    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    // Comprehensive error handling
    console.error(`Error registering ${body?.model_name}:`, error);

    // Validation Error Handling
    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: error.message,
        },
        { status: 400 }
      );
    }

    // Prisma Unique Constraint Violation
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: `Duplicate record in ${body?.model_name}`,
            details: error.meta,
          },
          { status: 409 }
        ); // Conflict status code
      }

      // Other Prisma errors
      return NextResponse.json(
        {
          error: `Database error for ${body?.model_name}`,
          details: error.message,
        },
        { status: 500 }
      );
    }

    // Generic Error Handling
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
