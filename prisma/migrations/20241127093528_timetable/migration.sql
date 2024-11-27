/*
  Warnings:

  - You are about to drop the column `academic_year_id` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the `timetable_slot` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[school_id,name]` on the table `academic_year` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[semester_id,date_for,made_by,scope]` on the table `announcement` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[semester_id,name]` on the table `award` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[school_id,name]` on the table `class` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[school_id,name]` on the table `department` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[semester_id,name]` on the table `event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[semester_id,name,type,start_date]` on the table `exam` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stream_id,subject_id,exam_id,sitting_date]` on the table `exam_sitting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[facility_name,type]` on the table `facility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[fee_type_id,amount,semester_id]` on the table `fee` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[school_id,name]` on the table `fee_type` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `parent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[reviewer_id,entity_type,title]` on the table `review` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `school` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[academic_year_id,name]` on the table `semester` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `staff` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[class_id,stream_name]` on the table `stream` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[user_id]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[department_id,name]` on the table `subject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[staff_id]` on the table `teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `semester_id` to the `fee` table without a default value. This is not possible if the table is not empty.
  - Made the column `school_id` on table `school_facility` required. This step will fail if there are existing NULL values in that column.
  - Made the column `facility_id` on table `school_facility` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "timetable_slot" DROP CONSTRAINT "timetable_slot_class_id_fkey";

-- DropForeignKey
ALTER TABLE "timetable_slot" DROP CONSTRAINT "timetable_slot_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "timetable_slot" DROP CONSTRAINT "timetable_slot_teacher_id_fkey";

-- AlterTable
ALTER TABLE "fee" DROP COLUMN "academic_year_id",
ADD COLUMN     "semester_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "school_facility" ALTER COLUMN "school_id" SET NOT NULL,
ALTER COLUMN "facility_id" SET NOT NULL,
ADD CONSTRAINT "school_facility_pkey" PRIMARY KEY ("school_id", "facility_id");

-- AlterTable
ALTER TABLE "subject" ALTER COLUMN "code" DROP NOT NULL;

-- DropTable
DROP TABLE "timetable_slot";

-- CreateTable
CREATE TABLE "slot" (
    "slot_id" SERIAL NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "room_number" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "slot_pkey" PRIMARY KEY ("slot_id")
);

-- CreateTable
CREATE TABLE "slot_assignment" (
    "assignment_id" SERIAL NOT NULL,
    "slot_id" INTEGER NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "slot_assignment_pkey" PRIMARY KEY ("assignment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "slot_day_of_week_start_time_end_time_key" ON "slot"("day_of_week", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "slot_assignment_slot_id_teacher_id_stream_id_key" ON "slot_assignment"("slot_id", "teacher_id", "stream_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_school_id_name_key" ON "academic_year"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_semester_id_date_for_made_by_scope_key" ON "announcement"("semester_id", "date_for", "made_by", "scope");

-- CreateIndex
CREATE UNIQUE INDEX "award_semester_id_name_key" ON "award"("semester_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "class_school_id_name_key" ON "class"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "department_school_id_name_key" ON "department"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "event_semester_id_name_key" ON "event"("semester_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "exam_semester_id_name_type_start_date_key" ON "exam"("semester_id", "name", "type", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "exam_sitting_stream_id_subject_id_exam_id_sitting_date_key" ON "exam_sitting"("stream_id", "subject_id", "exam_id", "sitting_date");

-- CreateIndex
CREATE UNIQUE INDEX "facility_facility_name_type_key" ON "facility"("facility_name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "fee_fee_type_id_amount_semester_id_key" ON "fee"("fee_type_id", "amount", "semester_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_type_school_id_name_key" ON "fee_type"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "parent_user_id_key" ON "parent"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "review_reviewer_id_entity_type_title_key" ON "review"("reviewer_id", "entity_type", "title");

-- CreateIndex
CREATE UNIQUE INDEX "school_name_key" ON "school"("name");

-- CreateIndex
CREATE UNIQUE INDEX "semester_academic_year_id_name_key" ON "semester"("academic_year_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_key" ON "staff"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "stream_class_id_stream_name_key" ON "stream"("class_id", "stream_name");

-- CreateIndex
CREATE UNIQUE INDEX "student_user_id_key" ON "student"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_department_id_name_key" ON "subject"("department_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_staff_id_key" ON "teacher"("staff_id");

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slot"("slot_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("teacher_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("stream_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
