/*
  Warnings:

  - The primary key for the `student_subject` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `academic_year_id` on the `student_subject` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `student_subject` table. All the data in the column will be lost.
  - You are about to drop the `teacher_subject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `subject_allocation_id` to the `student_subject` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "privileges" ADD VALUE 'admin_facility';
ALTER TYPE "privileges" ADD VALUE 'review_facility';
ALTER TYPE "privileges" ADD VALUE 'update_facility';

-- DropForeignKey
ALTER TABLE "student_subject" DROP CONSTRAINT "student_subject_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "student_subject" DROP CONSTRAINT "student_subject_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_subject" DROP CONSTRAINT "teacher_subject_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "teacher_subject" DROP CONSTRAINT "teacher_subject_teacher_id_fkey";

-- AlterTable
ALTER TABLE "student_subject" DROP CONSTRAINT "student_subject_pkey",
DROP COLUMN "academic_year_id",
DROP COLUMN "subject_id",
ADD COLUMN     "subject_allocation_id" INTEGER NOT NULL,
ADD CONSTRAINT "student_subject_pkey" PRIMARY KEY ("student_id", "subject_allocation_id");

-- DropTable
DROP TABLE "teacher_subject";

-- CreateTable
CREATE TABLE "subject_allocation" (
    "subject_allocation_id" SERIAL NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "assigned_date" DATE DEFAULT CURRENT_DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "subject_allocation_pkey" PRIMARY KEY ("subject_allocation_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subject_allocation_teacher_id_subject_id_key" ON "subject_allocation"("teacher_id", "subject_id");

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("academic_year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("subject_allocation_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
