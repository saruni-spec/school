/*
  Warnings:

  - You are about to drop the column `priviledges` on the `permission` table. All the data in the column will be lost.
  - Added the required column `privileges` to the `permission` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "roles_available" AS ENUM ('admin', 'auditor', 'principal', 'vice_pricipal', 'head_of_department', 'secretary', 'staff', 'teacher', 'faculty', 'parent', 'student', 'non_faculty');

-- CreateEnum
CREATE TYPE "privileges" AS ENUM ('VIEW_ALL_SCHOOLS', 'MANAGE_SCHOOLS', 'SYSTEM_CONFIGURATION', 'VIEW_ALL_SCHOOL_DETAILS', 'VIEW_SELF_SCHOOL_DETAILS', 'EDIT_ALL_SCHOOL_DETAILS', 'EDIT_SELF_SCHOOL_DETAILS', 'MANAGE_ALL_SCHOOL_USERS', 'MANAGE_SELF_SCHOOL_USERS', 'VIEW_ALL_CLASSES', 'VIEW_SELF_CLASSES', 'VIEW_SELF_SCHOOL_CLASSES', 'MANAGE_ALL_CLASSES', 'MANAGE_SELF_CLASSES', 'MANAGE_SELF_SCHOOL_CLASSES', 'VIEW_ALL_STREAMS', 'VIEW_SELF_STREAMS', 'VIEW_SELF_SCHOOL_STREAMS', 'MANAGE_ALL_STREAMS', 'MANAGE_SELF_STREAMS', 'MANAGE_SELF_SCHOOL_STREAMS', 'VIEW_ALL_USER_PROFILES', 'VIEW_SELF_USER_PROFILE', 'VIEW_SELF_SCHOOL_USER_PROFILES', 'EDIT_ALL_USER_PROFILES', 'EDIT_SELF_USER_PROFILE', 'EDIT_SELF_SCHOOL_USER_PROFILES', 'RESET_ALL_USER_PASSWORDS', 'RESET_SELF_USER_PASSWORD', 'RESET_SELF_SCHOOL_USER_PASSWORDS', 'VIEW_ALL_STAFF_PROFILES', 'VIEW_SELF_STAFF_PROFILE', 'VIEW_SELF_SCHOOL_STAFF_PROFILES', 'EDIT_ALL_STAFF_PROFILES', 'EDIT_SELF_STAFF_PROFILE', 'EDIT_SELF_SCHOOL_STAFF_PROFILES', 'RESET_ALL_STAFF_PASSWORDS', 'RESET_SELF_STAFF_PASSWORD', 'RESET_SELF_SCHOOL_STAFF_PASSWORDS', 'VIEW_ALL_TEACHER_PROFILES', 'VIEW_SELF_TEACHER_PROFILE', 'VIEW_SELF_SCHOOL_TEACHER_PROFILES', 'EDIT_ALL_TEACHER_PROFILES', 'EDIT_SELF_TEACHER_PROFILE', 'EDIT_SELF_SCHOOL_TEACHER_PROFILES', 'RESET_ALL_TEACHER_PASSWORDS', 'RESET_SELF_TEACHER_PASSWORD', 'RESET_SELF_SCHOOL_TEACHER_PASSWORDS', 'VIEW_ALL_PARENT_PROFILES', 'VIEW_SELF_PARENT_PROFILE', 'VIEW_SELF_SCHOOL_PARENT_PROFILES', 'EDIT_ALL_PARENT_PROFILES', 'EDIT_SELF_PARENT_PROFILE', 'EDIT_SELF_SCHOOL_PARENT_PROFILES', 'RESET_ALL_PARENT_PASSWORDS', 'RESET_SELF_PARENT_PASSWORD', 'RESET_SELF_SCHOOL_PARENT_PASSWORDS', 'VIEW_ALL_EXAMS', 'VIEW_SELF_SCHOOL_EXAMS', 'VIEW_SELF_EXAMS', 'CREATE_EXAMS', 'EDIT_ALL_EXAMS', 'EDIT_SELF_SCHOOL_EXAMS', 'EDIT_SELF_CLASS_EXAMS', 'EDIT_SELF_EXAMS', 'GRADE_ALL_EXAMS', 'GRADE_SELF_EXAMS', 'GRADE_SELF_SCHOOL_EXAMS', 'GRADE_SELF_CLASS_EXAMS', 'VIEW_ALL_EXAM_RESULTS', 'VIEW_SELF_SCHOOL_EXAM_RESULTS', 'VIEW_SELF_CLASS_EXAMS', 'VIEW_SELF_EXAM_RESULTS', 'VIEW_PERSONAL_RESULTS', 'SUBMIT_ASSIGNMENTS', 'VIEW_ALL_COURSE_MATERIALS', 'VIEW_SELF_COURSE_MATERIALS', 'VIEW_SELF_SCHOOL_COURSE_MATERIALS', 'VIEW_SELF_CLASS_COURSE_MATERIALS', 'MANAGE_ALL_COURSE_MATERIALS', 'MANAGE_SELF_COURSE_MATERIALS', 'MANAGE_SELF_SCHOOL_COURSE_MATERIALS', 'MANAGE_SELF_CLASS_COURSE_MATERIALS', 'TAKE_SELF_SCHOOL_ATTENDANCE', 'TAKE_SELF_CLASS_ATTENDANCE', 'TAKE_SELF_ATTENDANCE', 'VIEW_ALL_ATTENDANCE', 'VIEW_SELF_SCHOOL_ATTENDANCE', 'VIEW_SELF_CLASS_ATTENDANCE', 'VIEW_SELF_ATTENDANCE', 'VIEW_ALL_FINANCIAL_RECORDS', 'VIEW_SELF_FINANCIAL_RECORDS', 'VIEW_SELF_SCHOOL_FINANCIAL_RECORDS', 'VIEW_SELF_CLASS_FINANCIAL_RECORDS', 'MANAGE_ALL_FINANCIAL_RECORDS', 'MANAGE_SELF_FINANCIAL_RECORDS', 'MANAGE_SELF_SCHOOL_FINANCIAL_RECORDS', 'MANAGE_SELF_CLASS_FINANCIAL_RECORDS', 'VIEW_PERSONAL_FINANCIAL_INFO');

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "priviledges",
ADD COLUMN     "privileges" "privileges" NOT NULL;

-- AlterTable
ALTER TABLE "role" DROP COLUMN "role",
ADD COLUMN     "role" "roles_available" NOT NULL;

-- DropEnum
DROP TYPE "priviledges";

-- DropEnum
DROP TYPE "staff_role";

-- CreateTable
CREATE TABLE "coure_material" (
    "material_id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "subject_id" INTEGER,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "coure_material_pkey" PRIMARY KEY ("material_id")
);

-- AddForeignKey
ALTER TABLE "coure_material" ADD CONSTRAINT "coure_material_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
