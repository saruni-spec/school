import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

interface UpdateData {
  where: Record<string, any>;
  data: Record<string, any>;
}

interface UpdateRequest {
  data: UpdateData;
  model_name: string;
}

class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export async function POST(request: Request) {
  try {
    const body: UpdateRequest = await request.json();
    const { model_name, data } = body;

    if (!model_name || !data || !data.where || !data.data) {
      throw new ValidationError(
        "Missing required fields: model_name, data.where, or data.data"
      );
    }

    if (!(model_name in prisma)) {
      throw new ValidationError(`Invalid model name: ${model_name}`);
    }

    // Type-safe dynamic model update with support for nested updates
    const record = await prisma[model_name].update({
      where: data.where,
      data: data.data,
    });

    return NextResponse.json(record, { status: 200 });
  } catch (error) {
    console.error(`Error updating record:`, error);

    if (error instanceof ValidationError) {
      return NextResponse.json(
        {
          error: "Validation Error",
          details: error.message,
        },
        { status: 400 }
      );
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          {
            error: "Record not found",
            details: error.meta,
          },
          { status: 404 }
        );
      }

      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: "Unique constraint violation",
            details: error.meta,
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: "Database error",
          details: error.message,
        },
        { status: 500 }
      );
    }

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
