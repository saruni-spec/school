// app/api/complete-staff-registration.ts
import { NextResponse } from "next/server";
import { PrismaClient, Prisma, role_type } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { user_id, school_id, role_type } = await req.json();

    const result = await completeSchoolAdminRegistration(prisma, {
      user_id,
      school_id,
      role_type,
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

//Save a staff member and their role after registration
export async function completeSchoolAdminRegistration(
  prisma: PrismaClient,
  {
    role_type,
    user_id,
    school_id,
  }: {
    user_id: number;
    school_id: number;
    role_type: role_type;
  }
) {
  try {
    // Use Prisma transaction to ensure both operations happen atomically
    const result = await prisma.$transaction(async (tx) => {
      // First, find the role ID for school admin
      const schoolAdminRole = await tx.role.findUnique({
        where: { type: role_type },
        select: { id: true },
      });

      if (!schoolAdminRole) {
        throw new Error("School Admin role not found");
      }

      // Update user with the school admin role
      const updatedUser = await tx.users.update({
        where: { id: user_id },
        data: {
          role_id: schoolAdminRole.id,
        },
      });

      // Create staff member record
      const newStaffMember = await tx.staff.create({
        data: {
          user_id: user_id,
          school_id: school_id,
        },
      });

      return { user: updatedUser, staffMember: newStaffMember };
    });

    return result;
  } catch (error) {
    // Handle potential errors
    console.error("School admin registration failed:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Prisma-specific error handling
      if (error.code === "P2002") {
        throw new Error("Duplicate record found");
      }
    }

    throw error;
  }
}
