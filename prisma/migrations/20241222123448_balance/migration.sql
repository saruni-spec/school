/*
  Warnings:

  - You are about to drop the column `over_payment` on the `payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "over_payment",
ADD COLUMN     "balance" DECIMAL(10,2);
