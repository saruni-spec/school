"use server";
import prisma from "@/lib/prisma";

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
  //
  //get the streams in the school
  const streams = await prisma.stream.findMany({
    where: { school_id },
    select: { id: true, name: true, grade_level_id: true },
  });

  return streams;
}

export async function findUnpaidFees(userId: number) {
  const userStreams = await getUserStreams(userId);
  const userDepartments = await getUserDepartments(userId);
  const userSchool = await getUserSchool(userId);

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
            { for_individual: userId }, // Fees assigned to the user directly
            {
              for_stream: {
                in: userStreams, // Fees assigned to user's streams
              },
            },
            {
              for_department: {
                in: userDepartments, // Fees assigned to user's departments
              },
            },
            {
              whole_school: true,
              fee: { school_id: userSchool }, // Fees for the whole school where the user belongs
            },
          ],
        },
      ],
    },
    include: {
      fee: true, // Include fee details
      payment: true, // Include payment details
    },
  });

  // Serialize the fees before returning
  const fees = unpaidFees.map((feePayee) => ({
    // Fee payee fields
    id: feePayee.id,
    for_individual: feePayee.for_individual,
    for_stream: feePayee.for_stream,
    for_department: feePayee.for_department,
    whole_school: feePayee.whole_school,
    created_at: serializeDate(feePayee.created_at),
    updated_at: serializeDate(feePayee.updated_at),
    deleted_at: serializeDate(feePayee.deleted_at),

    // Fee fields prefixed with 'fee_'
    fee_id: feePayee.fee?.id,
    fee_code: feePayee.fee?.code,
    fee_type: feePayee.fee?.fee_for,
    fee_description: feePayee.fee?.description,
    fee_amount: feePayee.fee?.amount
      ? serializeDecimal(feePayee.fee.amount)
      : null,
    fee_installments: feePayee.fee?.installments,
    fee_due_date: serializeDate(feePayee.fee?.due_date),
    fee_school_id: feePayee.fee?.school_id,

    // Payment fields as an array of flattened payment objects
    payments: feePayee.payment.map((payment) => ({
      payment_id: payment.id,
      payment_amount: serializeDecimal(payment.amount),
      payment_status: payment.status,
      payment_created: serializeDate(payment.created_at),
      payment_updated: serializeDate(payment.updated_at),
      payment_deleted: serializeDate(payment.deleted_at),
    })),
  }));
  return fees;
}

// Add this type to represent the fee structure
type SerializedFee = {
  id: number;
  code: string;
  fee_for: string;
  description: string;
  approved_by: number;
  amount: string; // Changed from Decimal to string
  installments: number;
  due_date: string; // Date as ISO string
  school_id: number;
  created_at: string; // Date as ISO string
  updated_at: string; // Date as ISO string
  deleted_at: string | null; // Date as ISO string or null
};

// Add a serialization function
function serializeFee(fee: any): SerializedFee {
  return {
    ...fee,
    amount: fee.amount.toString(), // Convert Decimal to string
    due_date: fee.due_date.toISOString(),
    created_at: fee.created_at.toISOString(),
    updated_at: fee.updated_at.toISOString(),
    deleted_at: fee.deleted_at ? fee.deleted_at.toISOString() : null,
  };
}

function serializeDate(date: Date | null): string | null {
  return date ? date.toISOString() : null;
}

function serializeDecimal(decimal: Decimal): string {
  return decimal.toString();
}

// Helper functions
async function getUserStreams(userId: number) {
  const userStreams = await prisma.stream.findMany({
    where: {
      class_progression: {
        some: { student_class: { some: { student_id: userId } } }, // Streams linked to the user
      },
    },
    select: { id: true },
  });
  return userStreams.map((stream) => stream.id);
}

async function getUserDepartments(userId: number) {
  const userDepartments = await prisma.department.findMany({
    where: {
      department_staff: {
        some: { staff_id: userId }, // Departments linked to the user
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
