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
  room_number: string | null | undefined;
  slot_assignment: {
    stream_id: number;
    subject_allocation: {
      subject_grade_id: number | null;
      teacher_id: number | null;
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

// const records = await prisma.users.findUnique({
//   where: { id: Number(users_id) },
//   include: {
//     admin: true,
//     staff: {
//       include: {
//         department: true,
//         teacher: true,
//         school_leader: { include: { academic_year: true } },
//       },
//     },
//     student: true,
//     parent: true,
//     school: true,
//     role: true,
//   },
// });

export type User = Prisma.usersGetPayload<{
  include: {
    admin: true;
    staff: {
      include: {
        department: true;
        teacher: true;
        school_leader: { include: { academic_year: true } };
      };
    };
    student: true;
    parent: true;
    school: true;
    role: true;
  };
}>;

// export const getUpcomingSchoolEvents = async (schoolId: number) => {
//   const events = await prisma.event.findMany({
//     where: {
//       school_id: schoolId,
//       end_date: {
//         gte: new Date(), // Only get events that haven't ended yet
//       },
//       deleted_at: null, // Exclude deleted events
//     },
//     orderBy: {
//       start_date: "asc", // Order by start date ascending
//     },
//     select: {
//       id: true,
//       name: true,
//       description: true,
//       location: true,
//       start_date: true,
//       end_date: true,
//       scope: true,
//       users: { select: { id_code: true } },
//       event_class_participant: {
//         select: {
//           class_progression: { select: { stream: { select: { name: true } } } },
//         },
//       },
//       event_department_participant: {
//         select: { department: { select: { name: true } } },
//       },
//       event_school_participant: {
//         select: { school: { select: { name: true } } },
//       },
//       event_user_participant: {
//         select: { users: { select: { id_code: true } } },
//       },
//     },
//   });

//   return events;
// };

export type EventType = Prisma.eventGetPayload<{
  select: {
    id: true;
    name: true;
    description: true;
    location: true;
    start_date: true;
    end_date: true;
    scope: true;
    users: { select: { id_code: true } };
    event_class_participant: {
      select: {
        class_progression: { select: { stream: { select: { name: true } } } };
      };
    };
    event_department_participant: {
      select: { department: { select: { name: true } } };
    };
    event_school_participant: {
      select: { school: { select: { name: true } } };
    };
    event_user_participant: {
      select: { users: { select: { id_code: true } } };
    };
  };
}>;

// const assignments = await prisma.assignment_content.findMany({
//   where: {
//     OR: [
//       {
//         assignment: {
//           class_progression_id: Number(class_progression_id),
//         },
//       },
//       {
//         assignment: {
//           subject_allocation: {
//             stream: {
//               class_progression: {
//                 some: {
//                   id: Number(class_progression_id),
//                   is_current: true,
//                 },
//               },
//             },
//           },
//         },
//       },
//     ],
//   },
//   select: {
//     id: true,
//     question: true,
//     options: true,
//     assignment: {
//       select: {
//         description: true,
//         due_date: true,
//         file_path: true,
//         teacher: {
//           select: {
//             staff: {
//               select: { school_code: true },
//             },
//           },
//         },
//         subject_allocation: {
//           select: {
//             subject_grade: {
//               select: { name: true },
//             },
//           },
//         },
//       },
//     },
//     assignment_attempt: {
//       where: {
//         student: {
//           student_code: student_code,
//         },
//       },
//       select: {
//         answer: true,
//         date_submitted: true,
//         result: true,
//         remarks: true,
//       },
//     },
//   },
// });

export type AssignmentType = Prisma.assignment_contentGetPayload<{
  select: {
    id: true;
    question: true;
    options: true;
    assignment: {
      select: {
        description: true;
        due_date: true;
        file_path: true;
        teacher: {
          select: {
            staff: {
              select: { school_code: true };
            };
          };
        };
        subject_allocation: {
          select: {
            subject_grade: {
              select: { name: true };
            };
          };
        };
      };
    };
    assignment_attempt: {
      where: {
        student: {
          student_code: string;
        };
      };
      select: {
        answer: true;
        date_submitted: true;
        result: true;
        remarks: true;
      };
    };
  };
}>;

// assignment_attempt: {
//   where: {
//       student: {
//           student_code: string;
//       };
//   };
//   select: {
//       answer: true;
//       date_submitted: true;
//       result: true;
//       remarks: true;
//   };

export type AssignmentAttemptType = Prisma.assignment_attemptGetPayload<{
  where: {
    student: {
      student_code: string;
    };
  };
  select: {
    answer: true;
    date_submitted: true;
    result: true;
    remarks: true;
  };
}>;
// // Fetch all student_schedule from the specified users_id
// const attendance = await prisma.attendance.findMany({
//   where: { users_id: Number(users_id) },
//   select: {
//     staff_id: true,
//     taken_on: true,
//     status: true,
//     reason_for_absence: true,
//     notified_on: true,
//     to_miss_on: true,
//     up_to: true,
//     staff: { select: { school_code: true } },
//   },
// });

export type AttendanceType = Prisma.attendanceGetPayload<{
  select: {
    staff_id: true;
    taken_on: true;
    status: true;
    reason_for_absence: true;
    notified_on: true;
    to_miss_on: true;
    up_to: true;
    staff: { select: { school_code: true } };
  };
}>;

// const records = await prisma.assignment.findMany({
//   where: { teacher_id: parseInt(teacher_id) },
//   select: {
//     id: true,
//     description: true,
//     file_path: true,
//     subject_allocation_id: true,
//     assignment_content: {
//       select: {
//         id: true,
//         question: true,
//         options: true,
//         assignment_attempt: {
//           select: {
//             id: true,
//             student: { select: { student_code: true } },
//             answer: true,
//             date_submitted: true,
//             assignment_content_id: true,
//             date_marked: true,
//             remarks: true,
//             result: true,
//           },
//         },
//       },
//     },
//   },
// });

export type AssignmentDetailsType = Prisma.assignmentGetPayload<{
  select: {
    id: true;
    description: true;
    file_path: true;
    subject_allocation_id: true;
    assignment_content: {
      select: {
        id: true;
        question: true;
        options: true;
        assignment_attempt: {
          select: {
            id: true;
            student: { select: { student_code: true } };
            answer: true;
            date_submitted: true;
            assignment_content_id: true;
            date_marked: true;
            remarks: true;
            result: true;
          };
        };
      };
    };
  };
}>;
