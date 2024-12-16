/*
  Warnings:

  - You are about to drop the column `academic_year_for_payment` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `semester_for_payment` on the `fee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fee_for,amount,due_date]` on the table `fee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `fee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `installments` to the `fee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "installment_types" AS ENUM ('single_payment', 'weekly', 'monthly', 'semester', 'annual', 'emergency');

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_academic_year_for_payment_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_semester_for_payment_fkey";

-- DropIndex
DROP INDEX "fee_fee_for_amount_semester_for_payment_academic_year_for_p_key";

-- DropIndex
DROP INDEX "fee_semester_for_payment_academic_year_for_payment_idx";

-- AlterTable
ALTER TABLE "fee" DROP COLUMN "academic_year_for_payment",
DROP COLUMN "semester_for_payment",
ADD COLUMN     "code" VARCHAR(10) NOT NULL,
ADD COLUMN     "installments" "installment_types" NOT NULL;

-- CreateIndex
CREATE INDEX "fee_due_date_for_class_for_department_for_individual_for_sc_idx" ON "fee"("due_date", "for_class", "for_department", "for_individual", "for_school", "for_stream");

-- CreateIndex
CREATE UNIQUE INDEX "fee_fee_for_amount_due_date_key" ON "fee"("fee_for", "amount", "due_date");
