import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

// Grade level configurations
const GRADE_LEVELS = [
  { id: 1, name: "PRE_PRIMARY_1" },
  { id: 2, name: "PRE_PRIMARY_2" },
  { id: 3, name: "GRADE_1" },
  { id: 4, name: "GRADE_2" },
  { id: 5, name: "GRADE_3" },
  { id: 6, name: "GRADE_4" },
  { id: 7, name: "GRADE_5" },
  { id: 8, name: "GRADE_6" },
  { id: 9, name: "GRADE_7" },
  { id: 10, name: "GRADE_8" },
  { id: 11, name: "GRADE_9" },
  { id: 12, name: "GRADE_10" },
  { id: 13, name: "GRADE_11" },
  { id: 14, name: "GRADE_12" },
];

async function seed() {
  try {
    // Clear existing data
    await prisma.$transaction([
      prisma.student_class.deleteMany(),
      prisma.class_progression.deleteMany(),
      prisma.stream.deleteMany(),
      prisma.teacher.deleteMany(),
      prisma.school_leader.deleteMany(),
      prisma.staff.deleteMany(),
      prisma.student.deleteMany(),
      prisma.admin.deleteMany(),
      prisma.users.deleteMany(),
    ]);

    // Create streams and classes for each school
    for (let schoolId = 1; schoolId <= 4; schoolId++) {
      // Create school administrator
      const school_admin_first_name = faker.person.firstName();
      const school_admin_last_name = faker.person.lastName();

      await prisma.users.create({
        data: {
          first_name: school_admin_first_name,
          last_name: school_admin_last_name,
          name: `${school_admin_first_name} ${school_admin_last_name}`,
          id_code: `SCH${schoolId}-ADMIN-1-${new Date().getMilliseconds()}/${new Date().getFullYear()}`,
          email: faker.internet.email(),
          phone: faker.phone.number(),
          password: await hash("Password123!", SALT_ROUNDS),
          date_of_birth: faker.date.past({ years: 45 }),
          address: faker.location.streetAddress(),
          role_id: 4,
          school_id: schoolId,
          admin: {
            create: {},
          },
        },
      });

      // Create principal
      const principal_first_name = faker.person.firstName();
      const principal_last_name = faker.person.lastName();
      await prisma.users.create({
        data: {
          first_name: principal_first_name,
          last_name: principal_last_name,
          name: `${principal_first_name} ${principal_last_name}`,
          id_code: `SCH${schoolId}-PRINCIPAL-1-${new Date().getMilliseconds()}/${new Date().getFullYear()}`,
          email: faker.internet.email(),
          phone: faker.phone.number(),
          password: await hash("Password123!", SALT_ROUNDS),
          date_of_birth: faker.date.past({ years: 45 }),
          address: faker.location.streetAddress(),
          role_id: 2,
          school_id: schoolId,
          staff: {
            create: {
              school_code: `SCH${schoolId}-STAFF-1`,
              employment_status: "FULL_TIME",
              school_leader: {
                create: {},
              },
            },
          },
        },
      });

      // Create teachers - minimum 42 needed (14 grades × 3 streams)
      // Added extra for redundancy and future growth
      const teachers = [];
      for (let i = 0; i < 50; i++) {
        const teacher_first_name = faker.person.firstName();
        const teacher_last_name = faker.person.lastName();
        const teacher = await prisma.users.create({
          data: {
            first_name: teacher_first_name,
            last_name: teacher_last_name,
            name: `${teacher_first_name} ${teacher_last_name}`,
            id_code: `SCH${schoolId}-TEACHER-${
              i + 1
            }-${new Date().getMilliseconds()}/${new Date().getFullYear()}`,
            email: faker.internet.email(),
            phone: faker.phone.number(),
            password: await hash("Password123!", SALT_ROUNDS),
            date_of_birth: faker.date.past({ years: 35 }),
            address: faker.location.streetAddress(),
            role_id: 9,
            school_id: schoolId,
            staff: {
              create: {
                school_code: `SCH${schoolId}-STAFF-${i + 2}`,
                employment_status: "FULL_TIME",
                domain_role: "MEMBER",
                teacher: {
                  create: {
                    is_active: true,
                  },
                },
              },
            },
          },
          include: {
            staff: {
              include: {
                teacher: true,
              },
            },
          },
        });
        teachers.push(teacher);
      }

      // Create streams for each grade level
      const streamNames = ["A", "B", "C"]; // Three streams per grade

      for (const grade of GRADE_LEVELS) {
        for (const streamName of streamNames) {
          await prisma.stream.create({
            data: {
              grade_level_id: grade.id,
              school_id: schoolId,
              name: `${grade.name}-${streamName}`,
              capacity: grade.id <= 2 ? 25 : 35, // Smaller capacity for pre-primary
            },
          });
        }
      }

      // Get all streams for this school
      const streams = await prisma.stream.findMany({
        where: {
          school_id: schoolId,
        },
      });

      // Track assigned teachers per academic year
      const assignedTeachers = new Map();

      // Get academic years for this school
      const academicYears = await prisma.academic_year.findMany({
        where: {
          school_id: schoolId,
        },
      });
      // Create class progressions for each stream and academic year
      for (const academicYear of academicYears) {
        // Initialize tracking for this academic year
        assignedTeachers.set(academicYear.id, new Set());

        // Create all class progressions for this academic year
        for (const stream of streams) {
          // Get available teachers (not yet assigned in this academic year)
          const availableTeachers = teachers.filter(
            (teacher) =>
              !assignedTeachers
                .get(academicYear.id)
                .has(teacher.staff[0].teacher[0].id)
          );

          if (availableTeachers.length === 0) {
            throw new Error(
              `No available teachers for academic year ${academicYear.year}`
            );
          }

          // Select a random available teacher
          const randomTeacher =
            availableTeachers[
              Math.floor(Math.random() * availableTeachers.length)
            ];
          const teacherId = randomTeacher.staff[0].teacher[0].id;

          // Mark this teacher as assigned for this academic year
          assignedTeachers.get(academicYear.id).add(teacherId);

          const gradeName =
            GRADE_LEVELS.find((g) => g.id === stream.grade_level_id)?.name ||
            "";

          await prisma.class_progression.create({
            data: {
              name: `${gradeName} ${stream.name.split("-")[1]} ${
                academicYear.year
              }`,
              is_current: academicYear.is_current,
              academic_year_id: academicYear.id,
              stream_id: stream.id,
              teacher_id: teacherId,
            },
          });
        }
      }

      // Create students and distribute them among grades appropriately
      const studentsPerGrade = 30; // Average number of students per grade

      for (const grade of GRADE_LEVELS) {
        for (let i = 0; i < studentsPerGrade; i++) {
          const student_first_name = faker.person.firstName();
          const student_last_name = faker.person.lastName();

          const student = await prisma.users.create({
            data: {
              first_name: student_first_name,
              last_name: student_last_name,
              name: `${student_first_name} ${student_last_name}`,
              id_code: `SCH${schoolId}-STUDENT-${grade.id}-${
                i + 1
              }-${new Date().getMilliseconds()}/${new Date().getFullYear()}`,
              email: faker.internet.email(),
              phone: faker.phone.number(),
              password: await hash("Password123!", SALT_ROUNDS),
              date_of_birth: faker.date.past({
                years: grade.id <= 2 ? 6 : 6 + grade.id, // Appropriate age for grade level
                refDate: new Date("2024-01-01"),
              }),
              address: faker.location.streetAddress(),
              role_id: 26,
              school_id: schoolId,
              student: {
                create: {
                  admission_number: `ADM${schoolId}${grade.id}${String(
                    i + 1
                  ).padStart(3, "0")}`,
                  student_code: `STD${schoolId}-${grade.name}-${String(
                    i + 1
                  ).padStart(3, "0")}`,
                },
              },
            },
            include: {
              student: true,
            },
          });

          // Assign student to a class progression for current academic year
          const currentYearClasses = await prisma.class_progression.findMany({
            where: {
              academic_year: {
                school_id: schoolId,
                is_current: true,
              },
              stream: {
                grade_level_id: grade.id,
              },
            },
          });

          if (currentYearClasses.length > 0) {
            const randomClass =
              currentYearClasses[
                Math.floor(Math.random() * currentYearClasses.length)
              ];

            await prisma.student_class.create({
              data: {
                student_id: student.student[0].id,
                class_progression_id: randomClass.id,
                student_role: "MEMBER",
                admission_date: new Date(),
                start_date: new Date(),
              },
            });
          }
        }
      }
    }

    console.log("Seed completed successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch(console.error);
// ,
//   "prisma": {
//   "seed": "node --experimental-modules prisma/seed.js"
// }

// "type": "module",
