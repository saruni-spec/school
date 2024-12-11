/*
  Warnings:

  - You are about to drop the column `school_id` on the `class` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[academic_year_id,grade_level]` on the table `class` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `academic_year_id` to the `class` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "class" DROP CONSTRAINT "class_school_id_fkey";

-- DropIndex
DROP INDEX "class_school_id_name_key";

-- AlterTable
ALTER TABLE "class" DROP COLUMN "school_id",
ADD COLUMN     "academic_year_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "class_academic_year_id_grade_level_key" ON "class"("academic_year_id", "grade_level");

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
