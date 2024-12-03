/*
  Warnings:

  - You are about to drop the `student_subject` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stream_id` to the `subject_allocation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "student_subject" DROP CONSTRAINT "student_subject_student_id_fkey";

-- DropForeignKey
ALTER TABLE "student_subject" DROP CONSTRAINT "student_subject_subject_allocation_id_fkey";

-- AlterTable
ALTER TABLE "subject_allocation" ADD COLUMN     "stream_id" INTEGER NOT NULL;

-- DropTable
DROP TABLE "student_subject";

-- CreateTable
CREATE TABLE "student_ellectives" (
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "enrollment_date" DATE DEFAULT CURRENT_DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_ellectives_pkey" PRIMARY KEY ("student_id","subject_id")
);

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("stream_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
