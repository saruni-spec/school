/*
  Warnings:

  - You are about to drop the column `timetable_id` on the `slot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[day_of_week,start_time,time_table_id]` on the table `slot` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "slot" DROP CONSTRAINT "slot_timetable_id_fkey";

-- DropIndex
DROP INDEX "slot_day_of_week_start_time_timetable_id_key";

-- AlterTable
ALTER TABLE "slot" DROP COLUMN "timetable_id",
ADD COLUMN     "time_table_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "slot_day_of_week_start_time_time_table_id_key" ON "slot"("day_of_week", "start_time", "time_table_id");

-- AddForeignKey
ALTER TABLE "slot" ADD CONSTRAINT "slot_time_table_id_fkey" FOREIGN KEY ("time_table_id") REFERENCES "time_table"("id") ON DELETE CASCADE ON UPDATE CASCADE;
