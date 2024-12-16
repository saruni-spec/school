/*
  Warnings:

  - A unique constraint covering the columns `[grade_level_id,subject_id]` on the table `subject_grade` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "subject_grade_grade_level_id_subject_id_key" ON "subject_grade"("grade_level_id", "subject_id");
