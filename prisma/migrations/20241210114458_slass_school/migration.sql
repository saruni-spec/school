-- AlterTable
ALTER TABLE "student" ADD COLUMN     "current_class" INTEGER,
ADD COLUMN     "current_school" INTEGER;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_current_school_fkey" FOREIGN KEY ("current_school") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_current_class_fkey" FOREIGN KEY ("current_class") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
