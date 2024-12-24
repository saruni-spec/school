/*
  Warnings:

  - You are about to drop the column `details` on the `assignment_content` table. All the data in the column will be lost.
  - The `options` column on the `assignment_content` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[assignment_id,question]` on the table `assignment_content` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "assignment_content_assignment_id_key";

-- AlterTable
ALTER TABLE "assignment_content" DROP COLUMN "details",
ADD COLUMN     "question" TEXT,
DROP COLUMN "options",
ADD COLUMN     "options" JSONB[];

-- CreateIndex
CREATE UNIQUE INDEX "assignment_content_assignment_id_question_key" ON "assignment_content"("assignment_id", "question");
