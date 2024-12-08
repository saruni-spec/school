/*
  Warnings:

  - The values [ADMINISTRATOR] on the enum `role_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "role_type_new" AS ENUM ('SYSTEM_ADMINISTRATOR', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SCHOOL_ADMINISTRATOR', 'HEAD_OF_DEPARTMENT', 'ACADEMIC_REGISTRAR', 'EXAM_CONTROLLER', 'CURRICULUM_COORDINATOR', 'TEACHER', 'CLASS_TEACHER', 'FACULTY_MEMBER', 'ADMINISTRATIVE_STAFF', 'SECRETARY', 'FACILITY_MANAGER', 'FINANCIAL_OFFICER', 'HUMAN_RESOURCES_MANAGER', 'EVENT_COORDINATOR', 'LIBRARIAN', 'ASSISTANT_LIBRARIAN', 'TECHNOLOGY_SUPPORT', 'SECURITY_PERSONNEL', 'ADMISSIONS_OFFICER', 'COUNSELOR', 'MEDICAL_STAFF', 'CHEF', 'STUDENT', 'PARENT', 'AUDIT_OFFICER');
ALTER TABLE "role" ALTER COLUMN "type" TYPE "role_type_new" USING ("type"::text::"role_type_new");
ALTER TYPE "role_type" RENAME TO "role_type_old";
ALTER TYPE "role_type_new" RENAME TO "role_type";
DROP TYPE "role_type_old";
COMMIT;
