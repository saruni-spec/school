/*
  Warnings:

  - The primary key for the `student_class` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `admission_number` on the `student_class` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[student_code]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[student_id,class_progress]` on the table `student_class` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "student" ADD COLUMN     "admission_number" VARCHAR(20),
ADD COLUMN     "student_code" VARCHAR(20);

-- AlterTable
ALTER TABLE "student_class" DROP CONSTRAINT "student_class_pkey",
DROP COLUMN "admission_number",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "student_id" DROP NOT NULL,
ALTER COLUMN "class_progress" DROP NOT NULL,
ADD CONSTRAINT "student_class_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "student_student_code_key" ON "student"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "student_class_student_id_class_progress_key" ON "student_class"("student_id", "class_progress");
