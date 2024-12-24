import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { teacher_id: string } }
) {
  try {
    const { teacher_id } = await context.params; // Await the context.params object

    const records = await prisma.assignment.findMany({
      where: { teacher_id: parseInt(teacher_id) },
      select: {
        id: true,
        description: true,
        file_path: true,
        subject_allocation_id: true,
        assignment_content: {
          select: {
            id: true,
            question: true,
            options: true,
            assignment_attempt: {
              select: {
                id: true,
                student_id: true,
                date_submitted: true,
                assignment_content_id: true,
                date_marked: true,
                remarks: true,
                result: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(records, { status: 200 });
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
