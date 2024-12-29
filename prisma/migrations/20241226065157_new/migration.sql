/*
  Warnings:

  - You are about to drop the column `school_id` on the `slot` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[day_of_week,start_time,timetable_id]` on the table `slot` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "timetable_status" AS ENUM ('DRAFT', 'PUBLISHED');

-- DropForeignKey
ALTER TABLE "slot" DROP CONSTRAINT "slot_school_id_fkey";

-- DropIndex
DROP INDEX "slot_day_of_week_start_time_school_id_key";

-- AlterTable
ALTER TABLE "slot" DROP COLUMN "school_id",
ADD COLUMN     "is_break" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "timetable_id" INTEGER;

-- CreateTable
CREATE TABLE "time_table" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "school_id" INTEGER,
    "semester_id" INTEGER,
    "status" "timetable_status" NOT NULL DEFAULT 'DRAFT',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "slot_duration" INTEGER NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "days_per_week" INTEGER NOT NULL,
    "breaks" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "time_table_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "time_table_school_id_semester_id_is_active_key" ON "time_table"("school_id", "semester_id", "is_active");

-- CreateIndex
CREATE UNIQUE INDEX "slot_day_of_week_start_time_timetable_id_key" ON "slot"("day_of_week", "start_time", "timetable_id");

-- AddForeignKey
ALTER TABLE "slot" ADD CONSTRAINT "slot_timetable_id_fkey" FOREIGN KEY ("timetable_id") REFERENCES "time_table"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_table" ADD CONSTRAINT "time_table_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "time_table" ADD CONSTRAINT "time_table_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
