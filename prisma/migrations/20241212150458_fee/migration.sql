/*
  Warnings:

  - The values [single_payment,weekly,monthly,semester,annual,emergency] on the enum `installment_types` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "installment_types_new" AS ENUM ('SINGLE_PAYMENT', 'WEEKLY', 'MONTHLY', 'SEMESTER', 'ANNUAL', 'EMERGENCY');
ALTER TABLE "fee" ALTER COLUMN "installments" TYPE "installment_types_new" USING ("installments"::text::"installment_types_new");
ALTER TYPE "installment_types" RENAME TO "installment_types_old";
ALTER TYPE "installment_types_new" RENAME TO "installment_types";
DROP TYPE "installment_types_old";
COMMIT;
