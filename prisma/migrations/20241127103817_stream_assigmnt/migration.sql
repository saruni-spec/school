/*
  Warnings:

  - You are about to drop the column `academic_year_id` on the `class` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `class` table. All the data in the column will be lost.
  - You are about to drop the `student_school` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_teacher_id_fkey";

-- DropForeignKey
ALTER TABLE "student_school" DROP CONSTRAINT "student_school_stream_id_fkey";

-- DropForeignKey
ALTER TABLE "student_school" DROP CONSTRAINT "student_school_student_id_fkey";

-- AlterTable
ALTER TABLE "class" DROP COLUMN "academic_year_id",
DROP COLUMN "teacher_id";

-- DropTable
DROP TABLE "student_school";

-- CreateTable
CREATE TABLE "stream_assigment" (
    "stream_assigment_id" SERIAL NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stream_assigment_pkey" PRIMARY KEY ("stream_assigment_id")
);

-- CreateTable
CREATE TABLE "student_stream" (
    "student_id" INTEGER NOT NULL,
    "stream_assigment_id" INTEGER NOT NULL,
    "admission_number" VARCHAR(20),
    "admission_date" DATE NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_stream_pkey" PRIMARY KEY ("student_id","stream_assigment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "student_stream_admission_number_key" ON "student_stream"("admission_number");

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("academic_year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_stream" ADD CONSTRAINT "student_stream_stream_assigment_id_fkey" FOREIGN KEY ("stream_assigment_id") REFERENCES "stream_assigment"("stream_assigment_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_stream" ADD CONSTRAINT "student_stream_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
