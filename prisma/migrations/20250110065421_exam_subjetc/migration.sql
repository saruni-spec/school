/*
  Warnings:

  - You are about to drop the column `out_of` on the `exam_sitting` table. All the data in the column will be lost.
  - You are about to drop the column `remarks` on the `exam_sitting` table. All the data in the column will be lost.
  - You are about to drop the column `stream_id` on the `exam_sitting` table. All the data in the column will be lost.
  - You are about to drop the column `total_marks` on the `exam_sitting` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[subject_allocation_id,slot_id,sitting_date]` on the table `exam_sitting` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "exam_sitting" DROP CONSTRAINT "exam_sitting_stream_id_fkey";

-- DropIndex
DROP INDEX "exam_sitting_stream_id_subject_allocation_id_exam_id_sittin_key";

-- AlterTable
ALTER TABLE "exam_sitting" DROP COLUMN "out_of",
DROP COLUMN "remarks",
DROP COLUMN "stream_id",
DROP COLUMN "total_marks";

-- CreateIndex
CREATE UNIQUE INDEX "exam_sitting_subject_allocation_id_slot_id_sitting_date_key" ON "exam_sitting"("subject_allocation_id", "slot_id", "sitting_date");
