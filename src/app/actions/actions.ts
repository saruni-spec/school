"use server";
import prisma from "@/lib/prisma";
import { record } from "../types/types";

//
//register

//
// get the grade levels in a school
export async function getGradeLevels(school_id: number | undefined) {
  if (!school_id) return [];
  //
  //school has many levels offered
  //each level offered is associated with a school level
  //each level offered has multiple grades
  //first e need to find the levels offered by the school
  const levels_offered = await prisma.levels_offered.findMany({
    where: { school_id },
    select: { school_level: true },
  });

  //
  //get the grade levels for each level offered
  const grade_levels = await Promise.all(
    levels_offered.map(async (level) => {
      const grades = await prisma.grade_level.findMany({
        where: { school_level: level.school_level },
        select: { level: true, id: true },
      });
      return grades;
    })
  );

  return grade_levels.flat();
}

//
//get the streams in a school
export async function getStreams(school_id: number | undefined) {
  if (!school_id) return [];

  const streams = await prisma.stream.findMany({
    where: { school_id },
    select: { id: true, name: true, grade_level_id: true },
  });

  return streams;
}

//
//Get the unpaid fees for a user
export async function findUnpaidFees(user: record) {
  const userStreams = await getUserStreams(user);
  // const userDepartments = await getUserDepartments(user);
  const userSchool = await getUserSchool(user.id);

  const unpaidFees = await prisma.fee_payee.findMany({
    where: {
      AND: [
        {
          OR: [
            {
              payment: {
                none: { status: "COMPLETED" }, // No completed payment exists
              },
            },
            {
              payment: {
                some: { status: { not: "COMPLETED" } }, // Payment exists but status is not 'COMPLETED'
              },
            },
          ],
        },
        {
          OR: [
            { for_individual: user.id }, // Fees assigned to the user directly
            {
              for_stream: {
                in: userStreams, // Fees assigned to user's streams
              },
            },
            // {
            //   for_department: {
            //     in: userDepartments, // Fees assigned to user's departments
            //   },
            // },
            {
              whole_school: true,
              fee: { school_id: userSchool }, // Fees for the whole school where the user belongs
            },
          ],
        },
      ],
    },
    select: {
      fee: {
        select: {
          id: true,
          fee_for: true,
          code: true,
          approved_by: true,
          amount: true,
          installments: true,
          due_date: true,
        },
      },
      payment: { select: { amount: true, status: true } },
      id: true,
    },
  });
  //
  //format the unpaid fees
  const unpaid_fees = unpaidFees.map((fee) => ({
    fee_payee_id: fee.id,
    fee_id: fee.fee?.id,
    fee_for: fee.fee?.fee_for,
    fee_code: fee.fee?.code,
    approved_by: fee.fee?.approved_by,
    amount: fee.fee ? parseFloat(fee.fee.amount.toString()) : undefined,
    installments: fee.fee?.installments,
    due_date: fee.fee?.due_date,
    payments:
      fee.payment.length > 0
        ? fee.payment.map((payment) => ({
            status: payment.status,
            amount: parseFloat(payment.amount.toString()),
          }))
        : [],
  }));

  return unpaid_fees;
}

//
//Get the user's streams in their current school
async function getUserStreams(user: record) {
  const userStreams = await prisma.stream.findMany({
    where: {
      school_id: user.current_school as number, // Add constraint for user's current school
      class_progression: {
        some: {
          student_class: {
            some: {
              student_id: user.student
                ? (user.student.id as number)
                : undefined,
            },
          },
        },
      },
    },
    select: { id: true },
  });
  return userStreams.map((stream) => stream.id);
}
//
//Get the user's departments in their current school
export async function getUserDepartments(user: record) {
  const userDepartments = await prisma.department.findMany({
    where: {
      school_id: user.current_school as number, // Add constraint for user's current school
      department_staff: {
        some: { staff_id: user.id },
      },
    },
    select: { id: true },
  });
  return userDepartments.map((department) => department.id);
}

async function getUserSchool(userId: number) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { current_school: true },
  });
  return user?.current_school;
}

//
//get all current class progressions  and their associated streams for a specific school
export async function getCurrentClassProgressions(
  school_id: number | undefined
) {
  if (!school_id) return [];

  const classProgressions = await prisma.class_progression.findMany({
    where: {
      academic_year: { school_id, is_current: true },
      is_current: true,
    },
    select: {
      id: true,
      stream: {
        select: {
          id: true,
          name: true,
          grade_level: { select: { level: true } },
        },
      },
      academic_year: { select: { start_date: true } },
    },
  });
  return classProgressions;
}

//
//get departments in a school
export async function getDepartments(school_id: number | undefined) {
  if (!school_id) return [];

  const departments = await prisma.department.findMany({
    where: { school_id },
    select: { id: true, name: true },
  });

  return departments;
}
