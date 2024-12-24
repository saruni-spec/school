/*
  Warnings:

  - You are about to drop the column `assignment_id` on the `assignment_attempt` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[slot_id,teacher_id]` on the table `slot_assignment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "assignment_attempt" DROP CONSTRAINT "assignment_attempt_assignment_id_fkey";

-- DropIndex
DROP INDEX "assignment_attempt_assignment_id_idx";

-- DropIndex
DROP INDEX "slot_assignment_slot_id_teacher_id_stream_id_key";

-- AlterTable
ALTER TABLE "assignment" ADD COLUMN     "file_path" VARCHAR(50),
ADD COLUMN     "ref" TEXT;

-- AlterTable
ALTER TABLE "assignment_attempt" DROP COLUMN "assignment_id",
ADD COLUMN     "assignment_content_id" INTEGER,
ADD COLUMN     "submission" TEXT;

-- CreateTable
CREATE TABLE "assignment_content" (
    "id" SERIAL NOT NULL,
    "assignment_id" INTEGER,
    "details" TEXT,
    "options" JSONB,

    CONSTRAINT "assignment_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assignment_content_assignment_id_key" ON "assignment_content"("assignment_id");

-- CreateIndex
CREATE INDEX "assignment_attempt_assignment_content_id_idx" ON "assignment_attempt"("assignment_content_id");

-- CreateIndex
CREATE UNIQUE INDEX "slot_assignment_slot_id_teacher_id_key" ON "slot_assignment"("slot_id", "teacher_id");

-- AddForeignKey
ALTER TABLE "assignment_content" ADD CONSTRAINT "assignment_content_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_attempt" ADD CONSTRAINT "assignment_attempt_assignment_content_id_fkey" FOREIGN KEY ("assignment_content_id") REFERENCES "assignment_content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
