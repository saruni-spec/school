/*
  Warnings:

  - You are about to drop the column `stream_id` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `award` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `award` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - You are about to alter the column `awarded_by` on the `award` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(20)`.
  - You are about to drop the column `grade_level_id` on the `class_progression` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `exam` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(30)`.
  - You are about to drop the column `class_group_id` on the `stream` table. All the data in the column will be lost.
  - You are about to drop the `event_stream_participant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `stream_assigment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `student_stream` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[day_of_week,start_time,end_time,room_number]` on the table `slot` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[grade_level_id,name]` on the table `stream` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stream_id` to the `class_progression` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "event_scope" ADD VALUE 'GRADE';
ALTER TYPE "event_scope" ADD VALUE 'DEPARTMENT';
ALTER TYPE "event_scope" ADD VALUE 'INDIVIDUAL';

-- AlterEnum
ALTER TYPE "facility_type" ADD VALUE 'MEDICAL';

-- AlterEnum
ALTER TYPE "participant_type" ADD VALUE 'GUARDIAN';

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "award" DROP CONSTRAINT "award_school_id_fkey";

-- DropForeignKey
ALTER TABLE "class_progression" DROP CONSTRAINT "class_progression_grade_level_id_fkey";

-- DropForeignKey
ALTER TABLE "event_stream_participant" DROP CONSTRAINT "event_stream_participant_event_id_fkey";

-- DropForeignKey
ALTER TABLE "event_stream_participant" DROP CONSTRAINT "event_stream_participant_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "stream" DROP CONSTRAINT "stream_class_group_id_fkey";

-- DropForeignKey
ALTER TABLE "stream_assigment" DROP CONSTRAINT "stream_assigment_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "stream_assigment" DROP CONSTRAINT "stream_assigment_student_rep_fkey";

-- DropForeignKey
ALTER TABLE "stream_assigment" DROP CONSTRAINT "stream_assigment_teacher_rep_fkey";

-- DropForeignKey
ALTER TABLE "student_stream" DROP CONSTRAINT "student_stream_stream_assigment_id_fkey";

-- DropForeignKey
ALTER TABLE "student_stream" DROP CONSTRAINT "student_stream_student_id_fkey";

-- DropIndex
DROP INDEX "fee_due_date_for_class_for_department_for_individual_for_sc_idx";

-- DropIndex
DROP INDEX "slot_day_of_week_start_time_end_time_key";

-- DropIndex
DROP INDEX "stream_class_group_id_name_key";

-- AlterTable
ALTER TABLE "assignment" DROP COLUMN "stream_id",
ADD COLUMN     "class_group_id" INTEGER;

-- AlterTable
ALTER TABLE "award" DROP COLUMN "school_id",
ADD COLUMN     "for_class" INTEGER,
ADD COLUMN     "for_department" INTEGER,
ADD COLUMN     "for_individual" INTEGER,
ADD COLUMN     "for_school" INTEGER,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(20),
ALTER COLUMN "awarded_by" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "class_progression" DROP COLUMN "grade_level_id",
ADD COLUMN     "stream_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "exam" ADD COLUMN     "exam_providers" VARCHAR(30),
ALTER COLUMN "name" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "fee" ADD COLUMN     "for_grade" INTEGER;

-- AlterTable
ALTER TABLE "stream" DROP COLUMN "class_group_id",
ADD COLUMN     "grade_level_id" INTEGER,
ADD COLUMN     "school_id" INTEGER;

-- DropTable
DROP TABLE "event_stream_participant";

-- DropTable
DROP TABLE "stream_assigment";

-- DropTable
DROP TABLE "student_stream";

-- CreateTable
CREATE TABLE "student_class" (
    "student_id" INTEGER NOT NULL,
    "current_class" INTEGER NOT NULL,
    "admission_number" VARCHAR(20),
    "admission_date" DATE NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_class_pkey" PRIMARY KEY ("student_id","current_class")
);

-- CreateTable
CREATE TABLE "event_department_participant" (
    "event_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "participation_status" DEFAULT 'REGISTERED',
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_department_participant_pkey" PRIMARY KEY ("event_id","department_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_class_admission_number_key" ON "student_class"("admission_number");

-- CreateIndex
CREATE INDEX "fee_due_date_for_class_for_department_for_individual_for_sc_idx" ON "fee"("due_date", "for_class", "for_department", "for_individual", "for_school", "for_grade", "for_stream");

-- CreateIndex
CREATE UNIQUE INDEX "slot_day_of_week_start_time_end_time_room_number_key" ON "slot"("day_of_week", "start_time", "end_time", "room_number");

-- CreateIndex
CREATE UNIQUE INDEX "stream_grade_level_id_name_key" ON "stream"("grade_level_id", "name");

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_grade_level_id_fkey" FOREIGN KEY ("grade_level_id") REFERENCES "grade_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_progression" ADD CONSTRAINT "class_progression_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_current_class_fkey" FOREIGN KEY ("current_class") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_for_grade_fkey" FOREIGN KEY ("for_grade") REFERENCES "grade_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_for_individual_fkey" FOREIGN KEY ("for_individual") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_for_class_fkey" FOREIGN KEY ("for_class") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_for_department_fkey" FOREIGN KEY ("for_department") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_for_school_fkey" FOREIGN KEY ("for_school") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_department_participant" ADD CONSTRAINT "event_department_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_department_participant" ADD CONSTRAINT "event_department_participant_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
