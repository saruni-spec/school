/*
  Warnings:

  - A unique constraint covering the columns `[type]` on the table `school_level` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "school_level_type_key" ON "school_level"("type");
