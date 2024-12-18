-- AlterEnum
ALTER TYPE "payment_status" ADD VALUE 'OVERPAID';

-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "over_payment" DECIMAL(10,2);
