/*
  Warnings:

  - You are about to drop the column `submission` on the `assignment_attempt` table. All the data in the column will be lost.
  - You are about to drop the column `teacher_id` on the `slot_assignment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slot_id,subject_allocation_id]` on the table `slot_assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "assignment_content" DROP CONSTRAINT "assignment_content_assignment_id_fkey";

-- DropForeignKey
ALTER TABLE "slot_assignment" DROP CONSTRAINT "slot_assignment_teacher_id_fkey";

-- DropIndex
DROP INDEX "slot_assignment_slot_id_teacher_id_key";

-- DropIndex
DROP INDEX "slot_assignment_teacher_id_idx";

-- AlterTable
ALTER TABLE "assignment_attempt" DROP COLUMN "submission",
ADD COLUMN     "answer" TEXT;

-- AlterTable
ALTER TABLE "slot_assignment" DROP COLUMN "teacher_id";

-- CreateIndex
CREATE UNIQUE INDEX "slot_assignment_slot_id_subject_allocation_id_key" ON "slot_assignment"("slot_id", "subject_allocation_id");

-- AddForeignKey
ALTER TABLE "assignment_content" ADD CONSTRAINT "assignment_content_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
