/*
  Warnings:

  - You are about to drop the column `class_id` on the `subject` table. All the data in the column will be lost.
  - You are about to drop the column `code` on the `subject` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,department_id]` on the table `subject` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `subject_allocation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_class_id_fkey";

-- DropIndex
DROP INDEX "subject_class_id_name_key";

-- DropIndex
DROP INDEX "subject_code_key";

-- AlterTable
ALTER TABLE "subject" DROP COLUMN "class_id",
DROP COLUMN "code";

-- AlterTable
ALTER TABLE "subject_allocation" ADD COLUMN     "code" VARCHAR(20);

-- CreateIndex
CREATE UNIQUE INDEX "subject_name_department_id_key" ON "subject"("name", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_allocation_code_key" ON "subject_allocation"("code");
