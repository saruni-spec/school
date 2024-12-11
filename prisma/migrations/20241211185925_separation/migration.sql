/*
  Warnings:

  - The values [class_level] on the enum `event_scope` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `academic_year_id` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `grade_level` on the `class` table. All the data in the column will be lost.
  - The primary key for the `event_class_participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `class_id` on the `event_class_participant` table. All the data in the column will be lost.
  - You are about to drop the column `class_id` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `class_id` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `school` table. All the data in the column will be lost.
  - You are about to drop the column `class_id` on the `stream` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `stream_assigment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[class_group_id,name]` on the table `stream` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class_group_id` to the `event_class_participant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "event_scope_new" AS ENUM ('inter_school', 'intra_school', 'class_group', 'stream_level');
ALTER TABLE "announcement" ALTER COLUMN "scope" TYPE "event_scope_new" USING ("scope"::text::"event_scope_new");
ALTER TABLE "event" ALTER COLUMN "scope" TYPE "event_scope_new" USING ("scope"::text::"event_scope_new");
ALTER TYPE "event_scope" RENAME TO "event_scope_old";
ALTER TYPE "event_scope_new" RENAME TO "event_scope";
DROP TYPE "event_scope_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "event_class_participant" DROP CONSTRAINT "event_class_participant_class_id_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_class_id_fkey";

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_class_id_fkey";

-- DropForeignKey
ALTER TABLE "stream" DROP CONSTRAINT "stream_class_id_fkey";

-- DropForeignKey
ALTER TABLE "stream_assigment" DROP CONSTRAINT "stream_assigment_teacher_id_fkey";

-- DropIndex
DROP INDEX "class_academic_year_id_grade_level_key";

-- DropIndex
DROP INDEX "permission_resource_department_id_school_id_class_id_idx";

-- DropIndex
DROP INDEX "stream_class_id_name_key";

-- AlterTable
ALTER TABLE "class" DROP COLUMN "academic_year_id",
DROP COLUMN "grade_level";

-- AlterTable
ALTER TABLE "event_class_participant" DROP CONSTRAINT "event_class_participant_pkey",
DROP COLUMN "class_id",
ADD COLUMN     "class_group_id" INTEGER NOT NULL,
ADD CONSTRAINT "event_class_participant_pkey" PRIMARY KEY ("event_id", "class_group_id");

-- AlterTable
ALTER TABLE "fee" DROP COLUMN "class_id",
ADD COLUMN     "class_group_id" INTEGER;

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "class_id",
ADD COLUMN     "class_group_id" INTEGER;

-- AlterTable
ALTER TABLE "school" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "stream" DROP COLUMN "class_id",
ADD COLUMN     "class_group_id" INTEGER;

-- AlterTable
ALTER TABLE "stream_assigment" DROP COLUMN "teacher_id",
ADD COLUMN     "student_rep" INTEGER,
ADD COLUMN     "teacher_rep" INTEGER;

-- CreateTable
CREATE TABLE "levels_offered" (
    "school_id" INTEGER NOT NULL,
    "school_level_id" INTEGER NOT NULL,

    CONSTRAINT "levels_offered_pkey" PRIMARY KEY ("school_id","school_level_id")
);

-- CreateTable
CREATE TABLE "school_level" (
    "id" SERIAL NOT NULL,
    "type" "school_type" NOT NULL,

    CONSTRAINT "school_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade_level" (
    "id" SERIAL NOT NULL,
    "level" "grade_level_type" NOT NULL,
    "school_level_id" INTEGER,

    CONSTRAINT "grade_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grade" (
    "id" SERIAL NOT NULL,
    "class_group_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "grade_level_id" INTEGER NOT NULL,
    "class_teacher" INTEGER,
    "student_rep" INTEGER,

    CONSTRAINT "grade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "grade_class_group_id_academic_year_id_key" ON "grade"("class_group_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "permission_resource_department_id_school_id_class_group_id_idx" ON "permission"("resource", "department_id", "school_id", "class_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "stream_class_group_id_name_key" ON "stream"("class_group_id", "name");

-- AddForeignKey
ALTER TABLE "levels_offered" ADD CONSTRAINT "levels_offered_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "levels_offered" ADD CONSTRAINT "levels_offered_school_level_id_fkey" FOREIGN KEY ("school_level_id") REFERENCES "school_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grade_level" ADD CONSTRAINT "grade_level_school_level_id_fkey" FOREIGN KEY ("school_level_id") REFERENCES "school_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_grade_level_id_fkey" FOREIGN KEY ("grade_level_id") REFERENCES "grade_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_class_teacher_fkey" FOREIGN KEY ("class_teacher") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "grade" ADD CONSTRAINT "grade_student_rep_fkey" FOREIGN KEY ("student_rep") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_teacher_rep_fkey" FOREIGN KEY ("teacher_rep") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_student_rep_fkey" FOREIGN KEY ("student_rep") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
