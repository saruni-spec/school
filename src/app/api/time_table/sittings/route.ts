import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const temp_slots = await request.json();

    const createdSlots = await prisma.$transaction(async (tx) => {
      const results = [];

      for (const slot of temp_slots) {
        const exam_sittings = [];
        for (const exam_sitting_slot of slot.sitting) {
          exam_sittings.push({
            teacher_id: exam_sitting_slot.teacher_id,
            subject_allocation_id: exam_sitting_slot.subject_allocation_id,
            sitting_date: exam_sitting_slot.sitting_date,
          });
        }

        // Check for existing slot with the same time and day
        const existingSlot = await tx.slot.findFirst({
          where: {
            AND: [
              { time_table_id: slot.time_table_id },
              { start_time: slot.start_time },
              { day_of_week: slot.day_of_week.toUpperCase() },
            ],
          },
          include: {
            exam_sitting: {
              include: {
                subject_allocation: true,
              },
            },
          },
        });

        if (existingSlot) {
          // Update existing slot's assignments
          const updatedSlot = await tx.slot.update({
            where: {
              id: existingSlot.id,
            },
            data: {
              // Update end_time and room_number if needed
              end_time: slot.end_time,
              room_number: slot.room_number,
              // Add new exam sittings
              exam_sitting: {
                // Delete existing sittings
                deleteMany: {},
                // Create new sittings
                create: exam_sittings,
              },
            },
            include: {
              exam_sitting: {
                include: {
                  subject_allocation: { select: { id: true } },
                },
              },
            },
          });
          results.push(updatedSlot);
        } else {
          // Create new slot if none exists
          const createdSlot = await tx.slot.create({
            data: {
              start_time: slot.start_time,
              end_time: slot.end_time,
              day_of_week: slot.day_of_week.toUpperCase(),
              time_table_id: slot.time_table_id,
              room_number: slot.room_number,
              exam_sitting: {
                create: exam_sittings,
              },
            },
            include: {
              exam_sitting: {
                include: {
                  subject_allocation: { select: { id: true } },
                },
              },
            },
          });
          results.push(createdSlot);
        }
      }
      return results;
    });

    return NextResponse.json(createdSlots, { status: 201 });
  } catch (error) {
    console.error(`Error creating slots and assignments:`, error);
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          {
            error: `Duplicate record error`,
            details: error.meta,
          },
          { status: 409 }
        );
      }
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
