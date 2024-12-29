import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params; // Await the context.params object

    const records = await prisma.student.findFirst({
      where: {
        users_id: Number(id),
      },
      select: {
        id: true,
        student_code: true,
        admission_number: true,
        users: { select: { id: true, id_code: true } },
        student_class: {
          select: {
            class_progression: {
              where: { is_current: true },
              select: {
                id: true,
                name: true,
                teacher: {
                  select: {
                    staff: {
                      select: {
                        users: { select: { name: true, id_code: true } },
                      },
                    },
                  },
                },
                stream_id: true,
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
