/*
  Warnings:

  - You are about to drop the column `specialization` on the `teacher` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "department_staff_staff_id_idx";

-- AlterTable
ALTER TABLE "teacher" DROP COLUMN "specialization";
