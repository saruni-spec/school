import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// eslint-disable-next-line
export async function GET(request: Request, context: any) {
  try {
    const { id } = await context.params; // Await the context.params object

    const records = await prisma.school_leader.findFirst({
      where: {
        staff: {
          users_id: Number(id),
          users: { role: { type: { in: ["PRINCIPAL", "VICE_PRINCIPAL"] } } },
        },
        date_removed: null,
        // academic_year: { is_current: true },
      },
      select: {
        id: true,
        staff: {
          select: {
            id: true,
            school_code: true,
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
