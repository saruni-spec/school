/*
  Warnings:

  - You are about to drop the column `current_school` on the `student` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_current_school_fkey";

-- AlterTable
ALTER TABLE "student" DROP COLUMN "current_school";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_school" INTEGER;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_school_fkey" FOREIGN KEY ("current_school") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
