/*
  Warnings:

  - The values [CLASS_GROUP] on the enum `event_scope` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `class_group_id` on the `assignment` table. All the data in the column will be lost.
  - The primary key for the `event_class_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_group_id` on the `event_class_participant` table. All the data in the column will be lost.
  - You are about to drop the column `class_group_id` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `current_class` on the `student` table. All the data in the column will be lost.
  - The primary key for the `student_class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `class_progression` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[stream_id,academic_year_id]` on the table `class` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `stream_id` to the `class` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class_progression_id` to the `event_class_participant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_current` to the `student_class` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "event_scope_new" AS ENUM ('INTER_SCHOOL', 'INTRA_SCHOOL', 'class_progression', 'GRADE', 'DEPARTMENT', 'STREAM_LEVEL', 'INDIVIDUAL');
ALTER TABLE "announcement" ALTER COLUMN "scope" TYPE "event_scope_new" USING ("scope"::text::"event_scope_new");
ALTER TABLE "event" ALTER COLUMN "scope" TYPE "event_scope_new" USING ("scope"::text::"event_scope_new");
ALTER TYPE "event_scope" RENAME TO "event_scope_old";
ALTER TYPE "event_scope_new" RENAME TO "event_scope";
DROP TYPE "event_scope_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_class_group_id_fkey";

-- DropForeignKey
ALTER TABLE "class_progression" DROP CONSTRAINT "class_progression_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "class_progression" DROP CONSTRAINT "class_progression_class_group_id_fkey";

-- DropForeignKey
ALTER TABLE "class_progression" DROP CONSTRAINT "class_progression_class_teacher_fkey";

-- DropForeignKey
ALTER TABLE "class_progression" DROP CONSTRAINT "class_progression_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "class_progression" DROP CONSTRAINT "class_progression_student_rep_fkey";

-- DropForeignKey
ALTER TABLE "event_class_participant" DROP CONSTRAINT "event_class_participant_class_group_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_class_group_id_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_current_class_fkey";

-- DropIndex
DROP INDEX "permission_resource_department_id_school_id_class_group_id__idx";

-- AlterTable
ALTER TABLE "assignment" DROP COLUMN "class_group_id",
ADD COLUMN     "class_progression_id" INTEGER;

-- AlterTable
ALTER TABLE "class" ADD COLUMN     "academic_year_id" INTEGER,
ADD COLUMN     "class_teacher" INTEGER,
ADD COLUMN     "is_current" BOOLEAN,
ADD COLUMN     "stream_id" INTEGER NOT NULL,
ADD COLUMN     "student_rep" INTEGER;

-- AlterTable
ALTER TABLE "event_class_participant" DROP CONSTRAINT "event_class_participant_pkey",
DROP COLUMN "class_group_id",
ADD COLUMN     "class_progression_id" INTEGER NOT NULL,
ADD CONSTRAINT "event_class_participant_pkey" PRIMARY KEY ("event_id", "class_progression_id");

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "class_group_id",
ADD COLUMN     "class_progression_id" INTEGER;

-- AlterTable
ALTER TABLE "student" DROP COLUMN "current_class";

-- AlterTable
ALTER TABLE "student_class" DROP CONSTRAINT "student_class_pkey",
ADD COLUMN     "is_current" BOOLEAN NOT NULL,
ADD CONSTRAINT "student_class_pkey" PRIMARY KEY ("student_id", "admission_date");

-- DropTable
DROP TABLE "class_progression";

-- CreateIndex
CREATE UNIQUE INDEX "class_stream_id_academic_year_id_key" ON "class"("stream_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "permission_resource_department_id_school_id_class_progressi_idx" ON "permission"("resource", "department_id", "school_id", "class_progression_id", "role_id");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_class_teacher_fkey" FOREIGN KEY ("class_teacher") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_student_rep_fkey" FOREIGN KEY ("student_rep") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
