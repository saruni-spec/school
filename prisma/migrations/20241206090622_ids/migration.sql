/*
  Warnings:

  - The primary key for the `academic_year` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `academic_year_id` on the `academic_year` table. All the data in the column will be lost.
  - The primary key for the `admin` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `admin_id` on the `admin` table. All the data in the column will be lost.
  - The primary key for the `announcement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `announcement_id` on the `announcement` table. All the data in the column will be lost.
  - The primary key for the `assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignment_id` on the `assignment` table. All the data in the column will be lost.
  - The primary key for the `award` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `award_id` on the `award` table. All the data in the column will be lost.
  - The primary key for the `class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `class` table. All the data in the column will be lost.
  - The primary key for the `course_material` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `material_id` on the `course_material` table. All the data in the column will be lost.
  - The primary key for the `department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `department_id` on the `department` table. All the data in the column will be lost.
  - The primary key for the `event` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `event_id` on the `event` table. All the data in the column will be lost.
  - The primary key for the `exam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `exam_id` on the `exam` table. All the data in the column will be lost.
  - The primary key for the `exam_sitting` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `exam_sitting_id` on the `exam_sitting` table. All the data in the column will be lost.
  - The primary key for the `facility` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `facility_id` on the `facility` table. All the data in the column will be lost.
  - The primary key for the `fee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fee_id` on the `fee` table. All the data in the column will be lost.
  - The primary key for the `fee_type` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fee_type_id` on the `fee_type` table. All the data in the column will be lost.
  - The primary key for the `gallery` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gallery_id` on the `gallery` table. All the data in the column will be lost.
  - The primary key for the `lib_book` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `book_id` on the `lib_book` table. All the data in the column will be lost.
  - The primary key for the `medical` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `medical_id` on the `medical` table. All the data in the column will be lost.
  - The primary key for the `messages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `message_id` on the `messages` table. All the data in the column will be lost.
  - The primary key for the `parent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `parent_id` on the `parent` table. All the data in the column will be lost.
  - The primary key for the `payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `payment_id` on the `payment` table. All the data in the column will be lost.
  - The primary key for the `picture` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `picture_id` on the `picture` table. All the data in the column will be lost.
  - The primary key for the `review` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `review_id` on the `review` table. All the data in the column will be lost.
  - The primary key for the `role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `role_id` on the `role` table. All the data in the column will be lost.
  - The primary key for the `school` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `school_id` on the `school` table. All the data in the column will be lost.
  - The primary key for the `school_facility` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `school_facility_id` on the `school_facility` table. All the data in the column will be lost.
  - The primary key for the `semester` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `semester_id` on the `semester` table. All the data in the column will be lost.
  - The primary key for the `slot` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `slot_id` on the `slot` table. All the data in the column will be lost.
  - The primary key for the `slot_assignment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `assignment_id` on the `slot_assignment` table. All the data in the column will be lost.
  - The primary key for the `staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `staff_id` on the `staff` table. All the data in the column will be lost.
  - The primary key for the `stream` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stream_id` on the `stream` table. All the data in the column will be lost.
  - The primary key for the `stream_assigment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stream_assigment_id` on the `stream_assigment` table. All the data in the column will be lost.
  - The primary key for the `student` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `student_id` on the `student` table. All the data in the column will be lost.
  - The primary key for the `subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subject_id` on the `subject` table. All the data in the column will be lost.
  - The primary key for the `subject_allocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subject_allocation_id` on the `subject_allocation` table. All the data in the column will be lost.
  - The primary key for the `teacher` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `teacher_id` on the `teacher` table. All the data in the column will be lost.
  - The primary key for the `users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "academic_year" DROP CONSTRAINT "academic_year_school_id_fkey";

-- DropForeignKey
ALTER TABLE "admin" DROP CONSTRAINT "admin_user_id_fkey";

-- DropForeignKey
ALTER TABLE "announcement" DROP CONSTRAINT "announcement_made_by_fkey";

-- DropForeignKey
ALTER TABLE "announcement" DROP CONSTRAINT "announcement_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "award" DROP CONSTRAINT "award_school_id_fkey";

-- DropForeignKey
ALTER TABLE "award" DROP CONSTRAINT "award_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_school_id_fkey";

-- DropForeignKey
ALTER TABLE "course_material" DROP CONSTRAINT "course_material_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "department_school_id_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_created_by_fkey";

-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "event_class_participant" DROP CONSTRAINT "event_class_participant_class_id_fkey";

-- DropForeignKey
ALTER TABLE "event_class_participant" DROP CONSTRAINT "event_class_participant_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_school_participant" DROP CONSTRAINT "event_school_participant_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_school_participant" DROP CONSTRAINT "event_school_participant_school_id_fkey";

-- DropForeignKey
ALTER TABLE "event_stream_participant" DROP CONSTRAINT "event_stream_participant_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_stream_participant" DROP CONSTRAINT "event_stream_participant_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "event_user_participant" DROP CONSTRAINT "event_user_participant_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_user_participant" DROP CONSTRAINT "event_user_participant_user_id_fkey";

-- DropForeignKey
ALTER TABLE "exam" DROP CONSTRAINT "exam_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_sitting" DROP CONSTRAINT "exam_sitting_exam_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_sitting" DROP CONSTRAINT "exam_sitting_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_sitting" DROP CONSTRAINT "exam_sitting_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_sitting" DROP CONSTRAINT "exam_sitting_supervisor_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_class_id_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_fee_type_id_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "fee_type" DROP CONSTRAINT "fee_type_school_id_fkey";

-- DropForeignKey
ALTER TABLE "lib_book" DROP CONSTRAINT "lib_book_school_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "lib_book" DROP CONSTRAINT "lib_book_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "medical" DROP CONSTRAINT "medical_user_id_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_recepient_fkey";

-- DropForeignKey
ALTER TABLE "messages" DROP CONSTRAINT "messages_sender_fkey";

-- DropForeignKey
ALTER TABLE "parent" DROP CONSTRAINT "parent_user_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_student" DROP CONSTRAINT "parent_student_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_student" DROP CONSTRAINT "parent_student_student_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_fee_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_student_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_class_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_department_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_role_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_school_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_school_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "picture" DROP CONSTRAINT "picture_gallery_id_fkey";

-- DropForeignKey
ALTER TABLE "picture" DROP CONSTRAINT "picture_taken_by_fkey";

-- DropForeignKey
ALTER TABLE "result" DROP CONSTRAINT "result_exam_sitting_id_fkey";

-- DropForeignKey
ALTER TABLE "result" DROP CONSTRAINT "result_marked_by_fkey";

-- DropForeignKey
ALTER TABLE "result" DROP CONSTRAINT "result_student_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_event_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_reviewer_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_school_id_fkey";

-- DropForeignKey
ALTER TABLE "review" DROP CONSTRAINT "review_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "school_facility" DROP CONSTRAINT "school_facility_facility_id_fkey";

-- DropForeignKey
ALTER TABLE "school_facility" DROP CONSTRAINT "school_facility_overseer_fkey";

-- DropForeignKey
ALTER TABLE "school_facility" DROP CONSTRAINT "school_facility_school_id_fkey";

-- DropForeignKey
ALTER TABLE "semester" DROP CONSTRAINT "semester_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "slot_assignment" DROP CONSTRAINT "slot_assignment_slot_id_fkey";

-- DropForeignKey
ALTER TABLE "slot_assignment" DROP CONSTRAINT "slot_assignment_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "slot_assignment" DROP CONSTRAINT "slot_assignment_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "slot_assignment" DROP CONSTRAINT "slot_assignment_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_department_id_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_school_id_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_user_id_fkey";

-- DropForeignKey
ALTER TABLE "stream" DROP CONSTRAINT "stream_class_id_fkey";

-- DropForeignKey
ALTER TABLE "stream_assigment" DROP CONSTRAINT "stream_assigment_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "stream_assigment" DROP CONSTRAINT "stream_assigment_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_user_id_fkey";

-- DropForeignKey
ALTER TABLE "student_ellectives" DROP CONSTRAINT "student_ellectives_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "student_ellectives" DROP CONSTRAINT "student_ellectives_student_id_fkey";

-- DropForeignKey
ALTER TABLE "student_ellectives" DROP CONSTRAINT "student_ellectives_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "student_stream" DROP CONSTRAINT "student_stream_stream_assigment_id_fkey";

-- DropForeignKey
ALTER TABLE "student_stream" DROP CONSTRAINT "student_stream_student_id_fkey";

-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_class_id_fkey";

-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_department_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_allocation" DROP CONSTRAINT "subject_allocation_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_allocation" DROP CONSTRAINT "subject_allocation_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_allocation" DROP CONSTRAINT "subject_allocation_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_allocation" DROP CONSTRAINT "subject_allocation_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher" DROP CONSTRAINT "teacher_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_role_id_fkey";

-- AlterTable
ALTER TABLE "academic_year" DROP CONSTRAINT "academic_year_pkey",
DROP COLUMN "academic_year_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "academic_year_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "admin" DROP CONSTRAINT "admin_pkey",
DROP COLUMN "admin_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "admin_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "announcement" DROP CONSTRAINT "announcement_pkey",
DROP COLUMN "announcement_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "announcement_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_pkey",
DROP COLUMN "assignment_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "assignment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "award" DROP CONSTRAINT "award_pkey",
DROP COLUMN "award_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "award_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "class" DROP CONSTRAINT "class_pkey",
DROP COLUMN "class_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "class_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "course_material" DROP CONSTRAINT "course_material_pkey",
DROP COLUMN "material_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "course_material_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "department" DROP CONSTRAINT "department_pkey",
DROP COLUMN "department_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "department_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "event" DROP CONSTRAINT "event_pkey",
DROP COLUMN "event_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "event_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam" DROP CONSTRAINT "exam_pkey",
DROP COLUMN "exam_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "exam_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "exam_sitting" DROP CONSTRAINT "exam_sitting_pkey",
DROP COLUMN "exam_sitting_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "exam_sitting_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "facility" DROP CONSTRAINT "facility_pkey",
DROP COLUMN "facility_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "facility_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "fee" DROP CONSTRAINT "fee_pkey",
DROP COLUMN "fee_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "fee_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "fee_type" DROP CONSTRAINT "fee_type_pkey",
DROP COLUMN "fee_type_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "fee_type_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "gallery" DROP CONSTRAINT "gallery_pkey",
DROP COLUMN "gallery_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "gallery_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "lib_book" DROP CONSTRAINT "lib_book_pkey",
DROP COLUMN "book_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "lib_book_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "medical" DROP CONSTRAINT "medical_pkey",
DROP COLUMN "medical_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "medical_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "messages" DROP CONSTRAINT "messages_pkey",
DROP COLUMN "message_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "parent" DROP CONSTRAINT "parent_pkey",
DROP COLUMN "parent_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "parent_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "payment" DROP CONSTRAINT "payment_pkey",
DROP COLUMN "payment_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "payment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "picture" DROP CONSTRAINT "picture_pkey",
DROP COLUMN "picture_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "picture_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "review" DROP CONSTRAINT "review_pkey",
DROP COLUMN "review_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "review_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "role" DROP CONSTRAINT "role_pkey",
DROP COLUMN "role_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "role_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "school" DROP CONSTRAINT "school_pkey",
DROP COLUMN "school_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "school_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "school_facility" DROP CONSTRAINT "school_facility_pkey",
DROP COLUMN "school_facility_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "school_facility_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "semester" DROP CONSTRAINT "semester_pkey",
DROP COLUMN "semester_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "semester_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "slot" DROP CONSTRAINT "slot_pkey",
DROP COLUMN "slot_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "slot_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "slot_assignment" DROP CONSTRAINT "slot_assignment_pkey",
DROP COLUMN "assignment_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "slot_assignment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "staff" DROP CONSTRAINT "staff_pkey",
DROP COLUMN "staff_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "staff_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "stream" DROP CONSTRAINT "stream_pkey",
DROP COLUMN "stream_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "stream_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "stream_assigment" DROP CONSTRAINT "stream_assigment_pkey",
DROP COLUMN "stream_assigment_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "stream_assigment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "student" DROP CONSTRAINT "student_pkey",
DROP COLUMN "student_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "student_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subject" DROP CONSTRAINT "subject_pkey",
DROP COLUMN "subject_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "subject_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "subject_allocation" DROP CONSTRAINT "subject_allocation_pkey",
DROP COLUMN "subject_allocation_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "subject_allocation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "teacher" DROP CONSTRAINT "teacher_pkey",
DROP COLUMN "teacher_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "teacher_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" DROP CONSTRAINT "users_pkey",
DROP COLUMN "user_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_overseer_fkey" FOREIGN KEY ("overseer") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lib_book" ADD CONSTRAINT "lib_book_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lib_book" ADD CONSTRAINT "lib_book_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_year" ADD CONSTRAINT "academic_year_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "semester" ADD CONSTRAINT "semester_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_material" ADD CONSTRAINT "course_material_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "gallery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_taken_by_fkey" FOREIGN KEY ("taken_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "medical" ADD CONSTRAINT "medical_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_stream" ADD CONSTRAINT "student_stream_stream_assigment_id_fkey" FOREIGN KEY ("stream_assigment_id") REFERENCES "stream_assigment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_stream" ADD CONSTRAINT "student_stream_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam" ADD CONSTRAINT "exam_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_supervisor_fkey" FOREIGN KEY ("supervisor") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_fee_type_id_fkey" FOREIGN KEY ("fee_type_id") REFERENCES "fee_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_type" ADD CONSTRAINT "fee_type_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_made_by_fkey" FOREIGN KEY ("made_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_school_participant" ADD CONSTRAINT "event_school_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_school_participant" ADD CONSTRAINT "event_school_participant_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_stream_participant" ADD CONSTRAINT "event_stream_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_stream_participant" ADD CONSTRAINT "event_stream_participant_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_user_participant" ADD CONSTRAINT "event_user_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_user_participant" ADD CONSTRAINT "event_user_participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recepient_fkey" FOREIGN KEY ("recepient") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_fee_id_fkey" FOREIGN KEY ("fee_id") REFERENCES "fee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_exam_sitting_id_fkey" FOREIGN KEY ("exam_sitting_id") REFERENCES "exam_sitting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_marked_by_fkey" FOREIGN KEY ("marked_by") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
