/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `semester` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "semester_academic_year_id_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "semester_name_key" ON "semester"("name");
