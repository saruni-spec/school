import prisma from "@/lib/prisma";
import { attendance_status, Prisma } from "@prisma/client";
import { PrismaClientValidationError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";

/**
 *
 *Take the attendance for a class
 */
export async function POST(request: Request) {
  // Parse request body

  try {
    const attendanceRecords: {
      users_id: number;
      staff_id: number;
      class_progression_id: number;
      status: attendance_status;
      taken_on: Date;
    }[] = await request.json();

    //
    //
    //
    // Create an attendance record for each student
    const records = await prisma.attendance.createMany({
      data: attendanceRecords,
    });

    return NextResponse.json(records, { status: 201 });
  } catch (error) {
    // Comprehensive error handling
    console.error(`Error registering attendace:`, error);

    // Validation Error Handling
    if (error instanceof PrismaClientValidationError) {
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
            error: `Duplicate record in attendance for ${error.meta?.target}`,
            details: error.meta,
          },
          { status: 409 }
        ); // Conflict status code
      }

      // Other Prisma errors
      return NextResponse.json(
        {
          error: `Database error for attendance`,
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
