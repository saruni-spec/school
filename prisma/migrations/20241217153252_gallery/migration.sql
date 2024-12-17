/*
  Warnings:

  - You are about to drop the column `academic_year` on the `Gallery` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Gallery_academic_year_idx";

-- AlterTable
ALTER TABLE "Gallery" DROP COLUMN "academic_year";
