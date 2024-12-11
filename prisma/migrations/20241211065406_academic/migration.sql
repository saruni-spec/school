/*
  Warnings:

  - You are about to drop the column `name` on the `academic_year` table. All the data in the column will be lost.
  - You are about to drop the column `academic_year_id` on the `stream_assigment` table. All the data in the column will be lost.
  - You are about to drop the column `academic_year_id` on the `subject_allocation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[school_id,year]` on the table `academic_year` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `year` to the `academic_year` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester_id` to the `stream_assigment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `semester_id` to the `subject_allocation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "stream_assigment" DROP CONSTRAINT "stream_assigment_academic_year_id_fkey";

-- DropForeignKey
ALTER TABLE "subject_allocation" DROP CONSTRAINT "subject_allocation_academic_year_id_fkey";

-- DropIndex
DROP INDEX "academic_year_school_id_name_key";

-- AlterTable
ALTER TABLE "academic_year" DROP COLUMN "name",
ADD COLUMN     "year" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "stream_assigment" DROP COLUMN "academic_year_id",
ADD COLUMN     "semester_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "subject_allocation" DROP COLUMN "academic_year_id",
ADD COLUMN     "semester_id" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_school_id_year_key" ON "academic_year"("school_id", "year");

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
