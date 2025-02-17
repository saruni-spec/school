"use server";
import prisma from "@/lib/prisma";
import { MyRecord } from "../types/types";

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
export async function findUnpaidFees(user: MyRecord) {
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
            { users_id: user.id }, // Fees assigned to the user directly
            {
              stream_id: {
                in: userStreams, // Fees assigned to user's streams
              },
            },
            // {
            //   department_id: {
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
          school_leader_id: true,
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
    school_leader_id: fee.fee?.school_leader_id,
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
async function getUserStreams(user: MyRecord) {
  const userStreams = await prisma.stream.findMany({
    where: {
      school_id: user.school_id as number, // Add constraint for user's current school
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
export async function getUserDepartments(user: MyRecord) {
  const userDepartments = await prisma.department.findMany({
    where: {
      school_id: user.school_id as number, // Add constraint for user's current school
      staff: {
        some: { users_id: user.id },
      },
    },
    select: { id: true },
  });
  return userDepartments.map((department) => department.id);
}

async function getUserSchool(userId: number) {
  const user = await prisma.users.findUnique({
    where: { id: userId },
    select: { school_id: true },
  });
  return user?.school_id;
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

export const studentCount = async (school_id: number | undefined) =>
  await prisma.student.count({
    where: {
      student_class: {
        some: {
          class_progression: {
            is_current: true,
            stream: { school_id: school_id },
          },
        },
      },
    },
  });

export const teacherCount = async (school_id: number | undefined) =>
  await prisma.teacher.count({
    where: {
      staff: {
        // supposed to use department to find school_id
        users: { school_id: school_id },
      },
    },
  });

export const attendanceToday = async (school_id: number, date: string) => {
  const dateObj = new Date(date);
  // Use UTC methods instead of local time methods
  const startOfDay = new Date(dateObj);
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date(dateObj);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const attendance = await prisma.attendance.count({
    where: {
      AND: [
        {
          staff: { users: { school_id: school_id } },
          taken_on: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      ],
    },
  });
  return attendance;
};

export const getUpcomingSchoolEvents = async (schoolId: number) => {
  const events = await prisma.event.findMany({
    where: {
      school_id: schoolId,
      end_date: {
        gte: new Date(), // Only get events that haven't ended yet
      },
      deleted_at: null, // Exclude deleted events
    },
    orderBy: {
      start_date: "asc", // Order by start date ascending
    },
    select: {
      id: true,
      name: true,
      description: true,
      location: true,
      start_date: true,
      end_date: true,
      scope: true,
      users: { select: { id_code: true } },
      event_class_participant: {
        select: {
          class_progression: { select: { stream: { select: { name: true } } } },
        },
      },
      event_department_participant: {
        select: { department: { select: { name: true } } },
      },
      event_school_participant: {
        select: { school: { select: { name: true } } },
      },
      event_user_participant: {
        select: { users: { select: { id_code: true } } },
      },
    },
  });

  return events;
};

export const getSchedulesItems = async (users_id: number) =>
  await prisma.schedule_event.findMany({
    where: { schedule: { users_id: users_id } },
    select: {
      id: true,
      for: true,
      at_place: true,
      at_time: true,
      priority: true,
      notes: true,
      recurr_for: true,
    },
  });

export const numberOfUpcomingEvents = async (school_id: number) =>
  await prisma.event.count({
    where: {
      school_id: school_id,
      end_date: {
        gte: new Date(), // Only get events that haven't ended yet
      },
      deleted_at: null, // Exclude deleted events
    },
  });

export const getNewMessages = async (user_id: number) =>
  await prisma.messages.findMany({
    where: {
      created_at: {
        gte: new Date(),
      },
      recepient: user_id,
      deleted_at: null,
    },
    select: {
      id: true,
      message_details: true,
      severity: true,
      sender: true,
      created_at: true,
    },
  });

export const getNewAnnounceMents = async (school_id: number) =>
  await prisma.announcement.findMany({
    where: {
      date_for: {
        gte: new Date(),
      },
      school_id: school_id,
      deleted_at: null,
    },
    select: {
      id: true,
      announcement: true,
      date_for: true,
      valid_upto: true,
      scope: true,
      users: { select: { id_code: true } },
    },
  });
