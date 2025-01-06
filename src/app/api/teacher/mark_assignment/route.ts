import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
//
// Mark assignment attempt

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const records = await prisma.assignment_attempt.update({
      where: { id: data.id },
      data: {
        date_marked: data.date_marked,
        teacher_id: data.teacher_id,
        remarks: data.remarks,
        result: data.result,
        assessment: data.assessment,
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
