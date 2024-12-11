/*
  Warnings:

  - You are about to drop the column `subject_id` on the `assignment` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `exam_sitting` table. All the data in the column will be lost.
  - You are about to drop the column `subject_id` on the `slot_assignment` table. All the data in the column will be lost.
  - The primary key for the `student_ellectives` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subject_id` on the `student_ellectives` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stream_id,subject_allocation_id,exam_id,sitting_date]` on the table `exam_sitting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `grade_level` to the `course_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_allocation_id` to the `slot_assignment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subject_allocation_id` to the `student_ellectives` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "assignment" DROP CONSTRAINT "assignment_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "exam_sitting" DROP CONSTRAINT "exam_sitting_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "slot_assignment" DROP CONSTRAINT "slot_assignment_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "student_ellectives" DROP CONSTRAINT "student_ellectives_subject_id_fkey";

-- DropIndex
DROP INDEX "exam_sitting_stream_id_subject_id_exam_id_sitting_date_key";

-- AlterTable
ALTER TABLE "assignment" DROP COLUMN "subject_id",
ADD COLUMN     "subject_allocation_id" INTEGER;

-- AlterTable
ALTER TABLE "course_material" ADD COLUMN     "grade_level" "grade_level_type" NOT NULL,
ADD COLUMN     "published_by" INTEGER,
ADD COLUMN     "school_id" INTEGER;

-- AlterTable
ALTER TABLE "exam_sitting" DROP COLUMN "subject_id",
ADD COLUMN     "subject_allocation_id" INTEGER;

-- AlterTable
ALTER TABLE "slot_assignment" DROP COLUMN "subject_id",
ADD COLUMN     "subject_allocation_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "student_ellectives" DROP CONSTRAINT "student_ellectives_pkey",
DROP COLUMN "subject_id",
ADD COLUMN     "subject_allocation_id" INTEGER NOT NULL,
ADD CONSTRAINT "student_ellectives_pkey" PRIMARY KEY ("student_id", "subject_allocation_id");

-- CreateIndex
CREATE UNIQUE INDEX "exam_sitting_stream_id_subject_allocation_id_exam_id_sittin_key" ON "exam_sitting"("stream_id", "subject_allocation_id", "exam_id", "sitting_date");

-- AddForeignKey
ALTER TABLE "course_material" ADD CONSTRAINT "course_material_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_material" ADD CONSTRAINT "course_material_published_by_fkey" FOREIGN KEY ("published_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
