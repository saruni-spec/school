import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, due_date, code, fee_for, installments } = body;

    const fee = await prisma.fee.create({
      data: { amount, due_date, code, fee_for, installments },
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
