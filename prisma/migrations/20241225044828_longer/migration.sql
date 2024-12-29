/*
  Warnings:

  - A unique constraint covering the columns `[teacher_id,academic_year_id]` on the table `class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "class_teacher_id_academic_year_id_key" ON "class"("teacher_id", "academic_year_id");
