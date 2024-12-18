/*
  Warnings:

  - You are about to drop the column `staff_code` on the `department_staff` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "department_staff" DROP COLUMN "staff_code";

-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "staff_code" VARCHAR(20);

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "id_code" VARCHAR(30);
