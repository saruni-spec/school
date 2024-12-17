/*
  Warnings:

  - You are about to drop the column `semester_id` on the `announcement` table. All the data in the column will be lost.
  - You are about to drop the column `about` on the `picture` table. All the data in the column will be lost.
  - You are about to drop the column `picture_location` on the `picture` table. All the data in the column will be lost.
  - You are about to drop the column `taken_by` on the `picture` table. All the data in the column will be lost.
  - You are about to drop the column `taken_for` on the `picture` table. All the data in the column will be lost.
  - You are about to drop the `gallery` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[school_id,date_for,made_by,scope,valid_upto]` on the table `announcement` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `file_name` to the `picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_path` to the `picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `file_size` to the `picture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mime_type` to the `picture` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "picture_category" AS ENUM ('EVENT', 'DOCUMENT', 'CLASSROOM', 'FINANCIAL', 'STUDENT_WORK', 'FACILITY', 'EXTRACURRICULAR', 'ADMINISTRATIVE', 'ACHIEVEMENT', 'MISCELLANEOUS', 'EDUCATIONAL', 'LOST_AND_FOUND');

-- CreateEnum
CREATE TYPE "gallery_type" AS ENUM ('EVENT', 'SCHOOL', 'DEPARTMENT', 'CLASS', 'STUDENT', 'STAFF', 'ADMINISTRATIVE', 'FACILITY', 'FINANCE', 'ACHIEVEMENTS', 'MISCELLANEOUS');

-- CreateEnum
CREATE TYPE "gallery_visibility" AS ENUM ('PRIVATE', 'INTERNAL', 'PUBLIC');

-- DropForeignKey
ALTER TABLE "announcement" DROP CONSTRAINT "announcement_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "picture" DROP CONSTRAINT "picture_gallery_id_fkey";

-- DropForeignKey
ALTER TABLE "picture" DROP CONSTRAINT "picture_taken_by_fkey";

-- DropIndex
DROP INDEX "announcement_semester_id_date_for_made_by_scope_key";

-- AlterTable
ALTER TABLE "announcement" DROP COLUMN "semester_id",
ADD COLUMN     "school_id" INTEGER;

-- AlterTable
ALTER TABLE "award" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "picture" DROP COLUMN "about",
DROP COLUMN "picture_location",
DROP COLUMN "taken_by",
DROP COLUMN "taken_for",
ADD COLUMN     "file_name" VARCHAR(255) NOT NULL,
ADD COLUMN     "file_path" VARCHAR(500) NOT NULL,
ADD COLUMN     "file_size" INTEGER NOT NULL,
ADD COLUMN     "mime_type" VARCHAR(100) NOT NULL,
ADD COLUMN     "tags" VARCHAR(50)[],
ADD COLUMN     "taken_at" TIMESTAMPTZ(6),
ADD COLUMN     "title" VARCHAR(255),
ADD COLUMN     "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "uploaded_by" INTEGER;

-- DropTable
DROP TABLE "gallery";

-- CreateTable
CREATE TABLE "Gallery" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "gallery_type" NOT NULL,
    "visibility" "gallery_visibility" NOT NULL DEFAULT 'INTERNAL',
    "category" "picture_category" NOT NULL,
    "location" VARCHAR(255),
    "academic_year" VARCHAR(20),
    "created_by" VARCHAR(100),
    "tags" VARCHAR(50)[],
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Gallery_type_idx" ON "Gallery"("type");

-- CreateIndex
CREATE INDEX "Gallery_visibility_idx" ON "Gallery"("visibility");

-- CreateIndex
CREATE INDEX "Gallery_academic_year_idx" ON "Gallery"("academic_year");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_school_id_date_for_made_by_scope_valid_upto_key" ON "announcement"("school_id", "date_for", "made_by", "scope", "valid_upto");

-- CreateIndex
CREATE INDEX "picture_gallery_id_idx" ON "picture"("gallery_id");

-- CreateIndex
CREATE INDEX "picture_taken_at_idx" ON "picture"("taken_at");

-- CreateIndex
CREATE INDEX "picture_uploaded_at_idx" ON "picture"("uploaded_at");

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "Gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_uploaded_by_fkey" FOREIGN KEY ("uploaded_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
