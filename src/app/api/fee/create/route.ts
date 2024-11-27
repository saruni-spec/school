import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fee_type_id, amount, due_date, academic_year_id, class_id } = body;

    const fee = await prisma.fee.create({
      data: { fee_type_id, amount, due_date, academic_year_id, class_id },
    });
    return NextResponse.json(fee, { status: 201 });
  } catch (error) {
    console.error("Error registering fee:", error);
    return NextResponse.json(
      { error: "Error registering fee" },
      { status: 500 }
    );
  }
}
