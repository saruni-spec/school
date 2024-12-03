/*
  Warnings:

  - A unique constraint covering the columns `[class_id,name]` on the table `subject` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "subject_department_id_name_key";

-- AlterTable
ALTER TABLE "subject" ADD COLUMN     "class_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "subject_class_id_name_key" ON "subject"("class_id", "name");

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
