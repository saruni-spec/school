import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { id, name, address, contact_info, license_info, levels } =
      await request.json();

    // Start a transaction to update both school and levels_offered
    const result = await prisma.$transaction(async (tx) => {
      // Update school details
      const updatedSchool = await tx.school.update({
        where: { id },
        data: {
          name,
          address,
          contact_info,
          license_info,
          updated_at: new Date(),
        },
      });

      // Delete existing levels_offered for this school
      await tx.levels_offered.deleteMany({
        where: {
          school_id: id,
        },
      });

      // Create new levels_offered entries
      const levelsOffered = await tx.levels_offered.createMany({
        data: levels.map((school_level_id: number) => ({
          school_id: id,
          school_level_id,
        })),
      });

      return {
        school: updatedSchool,
        levelsOffered,
      };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Error updating school:", error);
    return NextResponse.json({
      message: "Error updating school",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    await prisma.$disconnect();
  }
}
