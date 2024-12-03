/*
  Warnings:

  - The primary key for the `permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `permission_id` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `privileges` on the `permission` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role_id,resource,department_id,deleted_at]` on the table `permission` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[type,category]` on the table `role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `resource` to the `permission` table without a default value. This is not possible if the table is not empty.
  - Made the column `role_id` on table `permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `created_at` on table `permission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `permission` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `name` to the `role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `role` table without a default value. This is not possible if the table is not empty.
  - Made the column `created_at` on table `role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updated_at` on table `role` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "privilege_category" AS ENUM ('ADMIN', 'MANAGEMENT', 'OPERATIONAL', 'REVIEW', 'SELF');

-- CreateEnum
CREATE TYPE "privilege_scope" AS ENUM ('GLOBAL', 'DEPARTMENTAL', 'PERSONAL');

-- CreateEnum
CREATE TYPE "system_resource" AS ENUM ('SCHOOL', 'USERS', 'STUDENTS', 'STAFF', 'DEPARTMENTS', 'EVENTS', 'EXAMS', 'FACILITIES', 'FINANCE', 'MEDICAL', 'LIBRARY', 'CLASSES', 'STREAMS', 'ADMISSIONS');

-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('SYSTEM_ADMIN', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SCHOOL_ADMIN', 'HEAD_OF_DEPARTMENT', 'REGISTRAR', 'EXAM_OFFICER', 'EVENT_MANAGER', 'FINANCE_OFFICER', 'FACILITY_MANAGER', 'LIBRARIAN', 'SECRETARY', 'TEACHER', 'CLASS_TEACHER', 'STAFF', 'PARENT', 'STUDENT', 'SECURITY', 'HUMAN_RESOURCE', 'MEDICAL_STAFF', 'ADMISSIONS', 'COUNSELOR', 'AUDITOR');

-- DropForeignKey
ALTER TABLE "permission" DROP CONSTRAINT "permission_role_id_fkey";

-- AlterTable
ALTER TABLE "permission" DROP CONSTRAINT "permission_pkey",
DROP COLUMN "permission_id",
DROP COLUMN "privileges",
ADD COLUMN     "can_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_create" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_delete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_read" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "can_update" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "department_id" INTEGER,
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "resource" "system_resource" NOT NULL,
ADD COLUMN     "scope" "privilege_scope" NOT NULL DEFAULT 'DEPARTMENTAL',
ADD COLUMN     "specific_context" JSONB,
ALTER COLUMN "role_id" SET NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "permission_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "role" DROP COLUMN "role",
ADD COLUMN     "category" "privilege_category",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" "role_type" NOT NULL,
ALTER COLUMN "created_at" SET NOT NULL,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "deleted_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET NOT NULL,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- DropEnum
DROP TYPE "privileges";

-- DropEnum
DROP TYPE "roles_available";

-- CreateIndex
CREATE INDEX "permission_resource_department_id_idx" ON "permission"("resource", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_role_id_resource_department_id_deleted_at_key" ON "permission"("role_id", "resource", "department_id", "deleted_at");

-- CreateIndex
CREATE UNIQUE INDEX "role_type_key" ON "role"("type");

-- CreateIndex
CREATE UNIQUE INDEX "role_type_category_key" ON "role"("type", "category");

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;
