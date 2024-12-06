/*
  Warnings:

  - The values [ADMIN,MANAGEMENT,REVIEW,SELF] on the enum `privilege_category` will be removed. If these variants are still used in the database, this will fail.
  - The values [SYSTEM_ADMIN,SCHOOL_ADMIN,REGISTRAR,EXAM_OFFICER,EVENT_MANAGER,FINANCE_OFFICER,STAFF,SECURITY,HUMAN_RESOURCE,ADMISSIONS,AUDITOR] on the enum `role_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [SCHOOL,EXAMS,FINANCE,CLASSES,STREAMS] on the enum `system_resource` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `coure_material` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "privilege_category_new" AS ENUM ('SYSTEM_ADMIN', 'EXECUTIVE', 'ADMINISTRATIVE', 'OPERATIONAL', 'SUPERVISORY', 'PERSONAL');
ALTER TABLE "role" ALTER COLUMN "category" TYPE "privilege_category_new" USING ("category"::text::"privilege_category_new");
ALTER TYPE "privilege_category" RENAME TO "privilege_category_old";
ALTER TYPE "privilege_category_new" RENAME TO "privilege_category";
DROP TYPE "privilege_category_old";
COMMIT;

-- AlterEnum
ALTER TYPE "privilege_scope" ADD VALUE 'INSTITUTIONAL';

-- AlterEnum
BEGIN;
CREATE TYPE "role_type_new" AS ENUM ('SYSTEM_ADMINISTRATOR', 'PRINCIPAL', 'VICE_PRINCIPAL', 'ADMINISTRATOR', 'HEAD_OF_DEPARTMENT', 'ACADEMIC_REGISTRAR', 'EXAM_CONTROLLER', 'CURRICULUM_COORDINATOR', 'TEACHER', 'CLASS_TEACHER', 'FACULTY_MEMBER', 'EVENT_COORDINATOR', 'FACILITY_MANAGER', 'FINANCIAL_OFFICER', 'LIBRARIAN', 'ADMINISTRATIVE_STAFF', 'SECRETARY', 'STUDENT', 'PARENT', 'COUNSELOR', 'ADMISSIONS_OFFICER', 'SECURITY_PERSONNEL', 'HUMAN_RESOURCES_MANAGER', 'MEDICAL_STAFF', 'TECHNOLOGY_SUPPORT', 'AUDIT_OFFICER');
ALTER TABLE "role" ALTER COLUMN "type" TYPE "role_type_new" USING ("type"::text::"role_type_new");
ALTER TYPE "role_type" RENAME TO "role_type_old";
ALTER TYPE "role_type_new" RENAME TO "role_type";
DROP TYPE "role_type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "system_resource_new" AS ENUM ('SYSTEM', 'INSTITUTION', 'USERS', 'STUDENTS', 'STAFF', 'DEPARTMENTS', 'EVENTS', 'EXAMINATIONS', 'FACILITIES', 'FINANCES', 'MEDICAL', 'LIBRARY', 'ACADEMIC_CLASSES', 'ACADEMIC_STREAMS', 'ADMISSIONS', 'CURRICULUM', 'COMMUNICATION');
ALTER TABLE "permission" ALTER COLUMN "resource" TYPE "system_resource_new" USING ("resource"::text::"system_resource_new");
ALTER TYPE "system_resource" RENAME TO "system_resource_old";
ALTER TYPE "system_resource_new" RENAME TO "system_resource";
DROP TYPE "system_resource_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "coure_material" DROP CONSTRAINT "coure_material_subject_id_fkey";

-- AlterTable
ALTER TABLE "staff" ALTER COLUMN "join_date" DROP NOT NULL,
ALTER COLUMN "join_date" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "coure_material";

-- CreateTable
CREATE TABLE "course_material" (
    "material_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "subject_id" INTEGER,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "course_material_pkey" PRIMARY KEY ("material_id")
);

-- AddForeignKey
ALTER TABLE "course_material" ADD CONSTRAINT "course_material_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
