/*
  Warnings:

  - You are about to drop the column `department_id` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the column `is_active` on the `subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_department_id_fkey";

-- DropIndex
DROP INDEX "subject_name_department_id_key";

-- AlterTable
ALTER TABLE "subject" DROP COLUMN "department_id",
DROP COLUMN "is_active";

-- AlterTable
ALTER TABLE "subject_allocation" ADD COLUMN     "department_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "subject_name_key" ON "subject"("name");

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
