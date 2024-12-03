/*
  Warnings:

  - The primary key for the `school_facility` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date_of_birth` on the `student` table. All the data in the column will be lost.
  - You are about to drop the column `medical_info` on the `student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[school_id,facility_id]` on the table `school_facility` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `overseer` to the `school_facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `date_of_birth` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "privileges" ADD VALUE 'admin_medical';
ALTER TYPE "privileges" ADD VALUE 'review_medical';
ALTER TYPE "privileges" ADD VALUE 'update_medical';
ALTER TYPE "privileges" ADD VALUE 'admin_lib';
ALTER TYPE "privileges" ADD VALUE 'review_lib';
ALTER TYPE "privileges" ADD VALUE 'update_lib';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "roles_available" ADD VALUE 'security';
ALTER TYPE "roles_available" ADD VALUE 'accounting';
ALTER TYPE "roles_available" ADD VALUE 'human_resource';
ALTER TYPE "roles_available" ADD VALUE 'doctor';
ALTER TYPE "roles_available" ADD VALUE 'chef';
ALTER TYPE "roles_available" ADD VALUE 'admmissions';
ALTER TYPE "roles_available" ADD VALUE 'counselor';

-- AlterTable
ALTER TABLE "admin" ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "permission" ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "role" ADD COLUMN     "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deleted_at" TIMESTAMPTZ(6),
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "school_facility" DROP CONSTRAINT "school_facility_pkey",
ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "closing_hours" TIMESTAMP(3),
ADD COLUMN     "opening_hours" TIMESTAMP(3),
ADD COLUMN     "overseer" INTEGER NOT NULL,
ADD COLUMN     "school_facility_id" SERIAL NOT NULL,
ADD CONSTRAINT "school_facility_pkey" PRIMARY KEY ("school_facility_id");

-- AlterTable
ALTER TABLE "student" DROP COLUMN "date_of_birth",
DROP COLUMN "medical_info";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "date_of_birth" DATE NOT NULL;

-- CreateTable
CREATE TABLE "lib_book" (
    "book_id" SERIAL NOT NULL,
    "school_facility_id" INTEGER NOT NULL,
    "book_name" TEXT NOT NULL,
    "reference_number" TEXT NOT NULL,
    "parental_advisory" BOOLEAN,
    "subject_id" INTEGER,
    "borrowed_by" INTEGER,
    "borrowed_on" TIMESTAMP(3),
    "due_by" TIMESTAMP(3),
    "returned_on" TIMESTAMP(3),
    "damaged_by" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "lib_book_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "medical" (
    "medical_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "notes" VARCHAR(100) NOT NULL,
    "medic_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "medical_pkey" PRIMARY KEY ("medical_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medical_description_key" ON "medical"("description");

-- CreateIndex
CREATE UNIQUE INDEX "medical_notes_key" ON "medical"("notes");

-- CreateIndex
CREATE UNIQUE INDEX "school_facility_school_id_facility_id_key" ON "school_facility"("school_id", "facility_id");

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_overseer_fkey" FOREIGN KEY ("overseer") REFERENCES "staff"("staff_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lib_book" ADD CONSTRAINT "lib_book_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("school_facility_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lib_book" ADD CONSTRAINT "lib_book_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical" ADD CONSTRAINT "medical_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
