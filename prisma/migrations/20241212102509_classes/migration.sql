/*
  Warnings:

  - You are about to drop the column `is_active` on the `class` table. All the data in the column will be lost.
  - You are about to drop the `grade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "grade" DROP CONSTRAINT "grade_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "grade" DROP CONSTRAINT "grade_class_group_id_fkey";

-- DropForeignKey
ALTER TABLE "grade" DROP CONSTRAINT "grade_class_teacher_fkey";

-- DropForeignKey
ALTER TABLE "grade" DROP CONSTRAINT "grade_grade_level_id_fkey";

-- DropForeignKey
ALTER TABLE "grade" DROP CONSTRAINT "grade_student_rep_fkey";

-- AlterTable
ALTER TABLE "class" DROP COLUMN "is_active";

-- DropTable
DROP TABLE "grade";

-- CreateTable
CREATE TABLE "class_progression" (
    "id" SERIAL NOT NULL,
    "class_group_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "grade_level_id" INTEGER NOT NULL,
    "class_teacher" INTEGER,
    "student_rep" INTEGER,
    "is_current" BOOLEAN,

    CONSTRAINT "class_progression_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "class_progression_class_group_id_academic_year_id_key" ON "class_progression"("class_group_id", "academic_year_id");

-- AddForeignKey
ALTER TABLE "class_progression" ADD CONSTRAINT "class_progression_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_progression" ADD CONSTRAINT "class_progression_grade_level_id_fkey" FOREIGN KEY ("grade_level_id") REFERENCES "grade_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_progression" ADD CONSTRAINT "class_progression_class_group_id_fkey" FOREIGN KEY ("class_group_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_progression" ADD CONSTRAINT "class_progression_class_teacher_fkey" FOREIGN KEY ("class_teacher") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class_progression" ADD CONSTRAINT "class_progression_student_rep_fkey" FOREIGN KEY ("student_rep") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
