/*
  Warnings:

  - You are about to drop the column `password_hash` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - Added the required column `role` to the `staff` table without a default value. This is not possible if the table is not empty.
  - Made the column `user_id` on table `staff` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "staff_role" AS ENUM ('teacher', 'head_of_department', 'principal', 'vice_pricipal', 'faculty', 'head_secretary', 'secretary', 'non_faculty');

-- CreateEnum
CREATE TYPE "priviledges_available" AS ENUM ('all', 'user', 'school', 'exam', 'school_user', 'school_exam', 'school_user_exam', 'event_award_announcement');

-- AlterTable
ALTER TABLE "staff" ADD COLUMN     "role" "staff_role" NOT NULL,
ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "user_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "password_hash",
DROP COLUMN "role",
ADD COLUMN     "password" TEXT NOT NULL;

-- DropEnum
DROP TYPE "user_role";

-- CreateTable
CREATE TABLE "admin" (
    "admin_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "priviledges" "priviledges_available" NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_id_key" ON "admin"("user_id");

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
