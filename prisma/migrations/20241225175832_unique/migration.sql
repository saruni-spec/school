/*
  Warnings:

  - A unique constraint covering the columns `[day_of_week,start_time,school_id]` on the table `slot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "slot_day_of_week_start_time_end_time_room_number_key";

-- AlterTable
ALTER TABLE "slot" ADD COLUMN     "school_id" INTEGER;

-- AlterTable
ALTER TABLE "subject_allocation" ALTER COLUMN "semester_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "slot_day_of_week_start_time_school_id_key" ON "slot"("day_of_week", "start_time", "school_id");

-- AddForeignKey
ALTER TABLE "slot" ADD CONSTRAINT "slot_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;
