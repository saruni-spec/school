// Import the Prisma type for time_table
import { Prisma } from "@prisma/client";

// 2. Create a type using Prisma's GetPayload
export type TimeTableType = Prisma.time_tableGetPayload<{
  select: {
    id: true;
    slot_duration: true;
    start_time: true;
    end_time: true;
    days_per_week: true;
    breaks: true;
    semester_id: true;
    school_id: true;
    slots: {
      select: {
        start_time: true;
        end_time: true;
        day_of_week: true;
        room_number: true;
        slot_assignment: {
          select: {
            stream_id: true;
            subject_allocation: {
              select: {
                subject_grade_id: true;
                teacher_id: true;
              };
            };
          };
        };
      };
    };
  };
}>;

// This type will match exactly what your query returns

// slots: {
//     start_time: string;
//     end_time: string;
//     day_of_week: $Enums.week_days;
//     room_number: string;
//     slot_assignment: {
//         ...;
//     }[];
// }[];
export type Slots = {
  start_time: string;
  end_time: string;
  day_of_week: string;
  room_number: string;
  slot_assignment: {
    stream_id: number;
    subject_allocation: {
      subject_grade_id: number;
      teacher_id: number;
    };
  }[];
};
export type StudentSchedule = Prisma.slot_assignmentGetPayload<{
  select: {
    id: true;
    slot: {
      select: {
        id: true;
        name: true;
        start_time: true;
        end_time: true;
        day_of_week: true;
        room_number: true;
      };
    };
    subject_allocation: {
      select: {
        stream_id: true;
        subject_grade: { select: { name: true } };
      };
    };
  };
}>;

export type TeacherSchedule = Prisma.slot_assignmentGetPayload<{
  select: {
    id: true;
    slot: {
      select: {
        id: true;
        name: true;
        start_time: true;
        end_time: true;
        day_of_week: true;
        room_number: true;
      };
    };
    subject_allocation: {
      select: {
        stream_id: true;
        subject_grade: { select: { name: true } };
      };
    };
  };
}>;

// const records = await prisma.attendance.findMany({
//   where: {
//     taken_on: {
//       gte: startOfDay,
//       lte: endOfDay,
//     },
//     class_progression_id: Number(class_progression_id),
//   },
//   select: {
//     users_id: true,
//     status: true,
//     class_progression_id: true,
//     staff_id: true,
//     taken_on: true,
//   },
// });

export type AttendanceToday = Prisma.attendanceGetPayload<{
  select: {
    users_id: true;
    status: true;
    class_progression_id: true;
    staff_id: true;
    taken_on: true;
  };
}>;
