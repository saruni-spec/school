/*
  Warnings:

  - You are about to drop the column `fee_type_id` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the `fee_type` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[fee_for,amount,semester_for_payment,academic_year_for_payment]` on the table `fee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fee_for` to the `fee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_fee_type_id_fkey";

-- DropForeignKey
ALTER TABLE "fee_type" DROP CONSTRAINT "fee_type_school_id_fkey";

-- DropIndex
DROP INDEX "fee_fee_type_id_amount_semester_for_payment_academic_year_f_key";

-- AlterTable
ALTER TABLE "fee" DROP COLUMN "fee_type_id",
ADD COLUMN     "description" VARCHAR(50),
DROP COLUMN "fee_for",
ADD COLUMN     "fee_for" "fee_type_enum" NOT NULL;

-- DropTable
DROP TABLE "fee_type";

-- CreateIndex
CREATE UNIQUE INDEX "fee_fee_for_amount_semester_for_payment_academic_year_for_p_key" ON "fee"("fee_for", "amount", "semester_for_payment", "academic_year_for_payment");
