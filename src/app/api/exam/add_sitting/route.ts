import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      exam_id,
      supervisor,
      subject_id,
      stream_id,
      out_of,
      remarks,
      sitting_date,
      total_marks,
    } = body;

    const examSitting = await prisma.exam_sitting.create({
      data: {
        exam_id,
        supervisor,
        subject_id,
        stream_id,
        out_of,
        remarks,
        sitting_date,
        total_marks,
      },
    });
    return NextResponse.json(examSitting, { status: 201 });
  } catch (error) {
    console.error("Error registering exam sitting:", error);
    return NextResponse.json(
      { error: "Error registering exam sitting" },
      { status: 500 }
    );
  }
}
