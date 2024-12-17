/*
  Warnings:

  - You are about to drop the column `for_class` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `for_department` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `for_grade` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `for_individual` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `for_school` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `for_stream` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `fee_id` on the `payment` table. All the data in the column will be lost.
  - You are about to drop the column `student_id` on the `payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_for_class_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_for_department_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_for_grade_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_for_individual_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_for_school_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_for_stream_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_fee_id_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_student_id_fkey";

-- DropIndex
DROP INDEX "fee_due_date_for_class_for_department_for_individual_for_sc_idx";

-- DropIndex
DROP INDEX "idx_payment_student_id";

-- AlterTable
ALTER TABLE "fee" DROP COLUMN "for_class",
DROP COLUMN "for_department",
DROP COLUMN "for_grade",
DROP COLUMN "for_individual",
DROP COLUMN "for_school",
DROP COLUMN "for_stream",
ADD COLUMN     "school_id" INTEGER,
ALTER COLUMN "code" SET DATA TYPE VARCHAR(20);

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "fee_id",
DROP COLUMN "student_id",
ADD COLUMN     "payed_by" INTEGER;

-- CreateTable
CREATE TABLE "fee_payee" (
    "id" SERIAL NOT NULL,
    "fee_id" INTEGER,
    "for_individual" INTEGER,
    "for_stream" INTEGER,
    "for_class" INTEGER,
    "for_department" INTEGER,
    "whole_school" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "fee_payee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "fee_payee_fee_id_for_class_for_department_for_individual_fo_idx" ON "fee_payee"("fee_id", "for_class", "for_department", "for_individual", "for_stream");

-- CreateIndex
CREATE INDEX "fee_due_date_idx" ON "fee"("due_date");

-- CreateIndex
CREATE INDEX "payment_payed_by_idx" ON "payment"("payed_by");

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_for_individual_fkey" FOREIGN KEY ("for_individual") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_for_stream_fkey" FOREIGN KEY ("for_stream") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_for_class_fkey" FOREIGN KEY ("for_class") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_for_department_fkey" FOREIGN KEY ("for_department") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_fee_id_fkey" FOREIGN KEY ("fee_id") REFERENCES "fee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_approved_by_fkey" FOREIGN KEY ("approved_by") REFERENCES "school_leader"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_payed_by_fkey" FOREIGN KEY ("payed_by") REFERENCES "fee_payee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
