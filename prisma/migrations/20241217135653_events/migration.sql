/*
  Warnings:

  - You are about to drop the column `semester_id` on the `event` table. All the data in the column will be lost.
  - You are about to drop the column `for_class` on the `fee_payee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,start_date,school_id]` on the table `event` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "event" DROP CONSTRAINT "event_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "fee_payee" DROP CONSTRAINT "fee_payee_for_class_fkey";

-- DropIndex
DROP INDEX "event_semester_id_name_key";

-- DropIndex
DROP INDEX "fee_payee_fee_id_for_class_for_department_for_individual_fo_idx";

-- DropIndex
DROP INDEX "student_class_admission_number_key";

-- AlterTable
ALTER TABLE "event" DROP COLUMN "semester_id",
ADD COLUMN     "school_id" INTEGER;

-- AlterTable
ALTER TABLE "fee_payee" DROP COLUMN "for_class";

-- CreateIndex
CREATE UNIQUE INDEX "event_name_start_date_school_id_key" ON "event"("name", "start_date", "school_id");

-- CreateIndex
CREATE INDEX "fee_payee_fee_id_idx" ON "fee_payee"("fee_id");

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
