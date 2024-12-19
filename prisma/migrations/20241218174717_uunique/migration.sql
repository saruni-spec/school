/*
  Warnings:

  - A unique constraint covering the columns `[grade_level_id,name,school_id]` on the table `stream` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "stream_grade_level_id_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "stream_grade_level_id_name_school_id_key" ON "stream"("grade_level_id", "name", "school_id");
