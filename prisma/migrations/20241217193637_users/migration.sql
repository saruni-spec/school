/*
  Warnings:

  - You are about to drop the column `payed_by` on the `payment` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_payed_by_fkey";

-- DropIndex
DROP INDEX "payment_payed_by_idx";

-- AlterTable
ALTER TABLE "payment" DROP COLUMN "payed_by",
ADD COLUMN     "fee_payee_id" INTEGER,
ADD COLUMN     "paid_by" INTEGER;

-- CreateIndex
CREATE INDEX "payment_paid_by_idx" ON "payment"("paid_by");

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_fee_payee_id_fkey" FOREIGN KEY ("fee_payee_id") REFERENCES "fee_payee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_paid_by_fkey" FOREIGN KEY ("paid_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
