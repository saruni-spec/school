/*
  Warnings:

  - A unique constraint covering the columns `[users_id,taken_on]` on the table `attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "attendance_users_id_created_at_key";

-- CreateIndex
CREATE UNIQUE INDEX "attendance_users_id_taken_on_key" ON "attendance"("users_id", "taken_on");
