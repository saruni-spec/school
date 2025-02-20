import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Extract parameters from the URL
    const { searchParams } = new URL(request.url);
    const class_progression_id = searchParams.get("class_progression_id");
    const student_code = searchParams.get("student_code");

    // Validate parameters
    if (!class_progression_id || !student_code) {
      console.log("Missing required parameters");
      return NextResponse.json(
        {
          error:
            "class_progression_id and student_code are required as query parameters",
        },
        { status: 400 }
      );
    }

    // Fetch assignments
    const assignments = await prisma.assignment_content.findMany({
      where: {
        OR: [
          {
            assignment: {
              class_progression_id: Number(class_progression_id),
            },
          },
          {
            assignment: {
              subject_allocation: {
                stream: {
                  class_progression: {
                    some: {
                      id: Number(class_progression_id),
                      is_current: true,
                    },
                  },
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        question: true,
        options: true,
        assignment: {
          select: {
            description: true,
            due_date: true,
            file_path: true,
            teacher: {
              select: {
                staff: {
                  select: { school_code: true },
                },
              },
            },
            subject_allocation: {
              select: {
                subject_grade: {
                  select: { name: true },
                },
              },
            },
          },
        },
        assignment_attempt: {
          where: {
            student: {
              student_code: student_code,
            },
          },
          select: {
            answer: true,
            date_submitted: true,
            result: true,
            remarks: true,
          },
        },
      },
    });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error("Error in assignment fetch:", error);
    if (error instanceof Error) {
      return NextResponse.json(
        { error: "Error fetching assignments", details: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "Unexpected error fetching assignments" },
      { status: 500 }
    );
  }
}
