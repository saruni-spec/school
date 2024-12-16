/*
  Warnings:

  - You are about to drop the column `code` on the `subject_allocation` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `subject_allocation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teacher_id,subject_grade_id]` on the table `subject_allocation` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "subject_allocation" DROP CONSTRAINT "subject_allocation_subject_id_fkey";

-- DropIndex
DROP INDEX "subject_allocation_code_key";

-- DropIndex
DROP INDEX "subject_allocation_teacher_id_subject_id_key";

-- AlterTable
ALTER TABLE "subject_allocation" DROP COLUMN "code",
DROP COLUMN "subject_id",
ADD COLUMN     "subject_grade_id" INTEGER;

-- CreateTable
CREATE TABLE "subject_grade" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER,
    "grade_level_id" INTEGER,
    "name" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_grade_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "subject_allocation_teacher_id_subject_grade_id_key" ON "subject_allocation"("teacher_id", "subject_grade_id");

-- AddForeignKey
ALTER TABLE "subject_grade" ADD CONSTRAINT "subject_grade_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_grade" ADD CONSTRAINT "subject_grade_grade_level_id_fkey" FOREIGN KEY ("grade_level_id") REFERENCES "grade_level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_subject_grade_id_fkey" FOREIGN KEY ("subject_grade_id") REFERENCES "subject_grade"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
