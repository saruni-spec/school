/*
  Warnings:

  - Changed the type of `day_of_week` on the `slot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "week_days" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "slot" DROP COLUMN "day_of_week",
ADD COLUMN     "day_of_week" "week_days" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "slot_day_of_week_start_time_end_time_room_number_key" ON "slot"("day_of_week", "start_time", "end_time", "room_number");
