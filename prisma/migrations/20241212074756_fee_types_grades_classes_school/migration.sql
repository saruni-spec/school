/*
  Warnings:

  - The values [present,absent,late,excused] on the enum `attendance_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [full_time,part_time,contract,intern,temporary] on the enum `employment_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [participant,organizer,judge,supervisor] on the enum `event_role` will be removed. If these variants are still used in the database, this will fail.
  - The values [inter_school,intra_school,class_group,stream_level] on the enum `event_scope` will be removed. If these variants are still used in the database, this will fail.
  - The values [quiz,mid_term,final,assignment] on the enum `exam_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [Educational,Recreational,Dining,Sports,Transportation] on the enum `facility_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [tuition,library,sports,transport,miscellaneous] on the enum `fee_type_enum` will be removed. If these variants are still used in the database, this will fail.
  - The values [student,teacher,staff,guest] on the enum `participant_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [registered,attended,absent,withdrawn,disqualified] on the enum `participation_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [cash,bank_transfer,credit_card,mobile_money,cheque] on the enum `payment_method` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,completed,failed,refunded] on the enum `payment_status` will be removed. If these variants are still used in the database, this will fail.
  - The values [father,mother,guardian,other] on the enum `relationship_type` will be removed. If these variants are still used in the database, this will fail.
  - The values [school,school_facility,event,teacher] on the enum `reviewable_entity` will be removed. If these variants are still used in the database, this will fail.
  - The values [emergency,urgent,priotity,inquiry,low] on the enum `severity` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `class_group_id` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `semester_id` on the `fee` table. All the data in the column will be lost.
  - You are about to drop the column `school_id` on the `staff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fee_type_id,amount,semester_for_payment,academic_year_for_payment]` on the table `fee` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "attendance_status_new" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');
ALTER TYPE "attendance_status" RENAME TO "attendance_status_old";
ALTER TYPE "attendance_status_new" RENAME TO "attendance_status";
DROP TYPE "attendance_status_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "employment_status_new" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'TEMPORARY', 'NONE');
ALTER TABLE "staff" ALTER COLUMN "employment_status" TYPE "employment_status_new" USING ("employment_status"::text::"employment_status_new");
ALTER TYPE "employment_status" RENAME TO "employment_status_old";
ALTER TYPE "employment_status_new" RENAME TO "employment_status";
DROP TYPE "employment_status_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "event_role_new" AS ENUM ('PARTICIPANT', 'ORGANIZER', 'JUDGE', 'SUPERVISOR');
ALTER TABLE "event_user_participant" ALTER COLUMN "role" TYPE "event_role_new" USING ("role"::text::"event_role_new");
ALTER TYPE "event_role" RENAME TO "event_role_old";
ALTER TYPE "event_role_new" RENAME TO "event_role";
DROP TYPE "event_role_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "event_scope_new" AS ENUM ('INTER_SCHOOL', 'INTRA_SCHOOL', 'CLASS_GROUP', 'STREAM_LEVEL');
ALTER TABLE "announcement" ALTER COLUMN "scope" TYPE "event_scope_new" USING ("scope"::text::"event_scope_new");
ALTER TABLE "event" ALTER COLUMN "scope" TYPE "event_scope_new" USING ("scope"::text::"event_scope_new");
ALTER TYPE "event_scope" RENAME TO "event_scope_old";
ALTER TYPE "event_scope_new" RENAME TO "event_scope";
DROP TYPE "event_scope_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "exam_type_new" AS ENUM ('QUIZ', 'MID_TERM', 'FINAL', 'ASSIGNMENT');
ALTER TABLE "exam" ALTER COLUMN "type" TYPE "exam_type_new" USING ("type"::text::"exam_type_new");
ALTER TYPE "exam_type" RENAME TO "exam_type_old";
ALTER TYPE "exam_type_new" RENAME TO "exam_type";
DROP TYPE "exam_type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "facility_type_new" AS ENUM ('EDUCATIONAL', 'RECREATIONAL', 'DINING', 'SPORTS', 'TRANSPORTATION');
ALTER TABLE "facility" ALTER COLUMN "type" TYPE "facility_type_new" USING ("type"::text::"facility_type_new");
ALTER TYPE "facility_type" RENAME TO "facility_type_old";
ALTER TYPE "facility_type_new" RENAME TO "facility_type";
DROP TYPE "facility_type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "fee_type_enum_new" AS ENUM ('TUITION', 'LIBRARY', 'SPORTS', 'TRANSPORT', 'FACILITY', 'DEVELOPMENT', 'COURSE_MATERIAL', 'STATIONERY', 'UNIFORM', 'MEDICAL', 'CULINARY', 'LAB', 'EVENT_PARTIPATION', 'DAMAGE', 'FINE', 'MISCELLANEOUS');
ALTER TABLE "fee_type" ALTER COLUMN "name" TYPE "fee_type_enum_new" USING ("name"::text::"fee_type_enum_new");
ALTER TYPE "fee_type_enum" RENAME TO "fee_type_enum_old";
ALTER TYPE "fee_type_enum_new" RENAME TO "fee_type_enum";
DROP TYPE "fee_type_enum_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "participant_type_new" AS ENUM ('STUDENT', 'TEACHER', 'STAFF', 'GUEST');
ALTER TABLE "event_user_participant" ALTER COLUMN "participant_type" TYPE "participant_type_new" USING ("participant_type"::text::"participant_type_new");
ALTER TYPE "participant_type" RENAME TO "participant_type_old";
ALTER TYPE "participant_type_new" RENAME TO "participant_type";
DROP TYPE "participant_type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "participation_status_new" AS ENUM ('REGISTERED', 'ATTENDED', 'ABSENT', 'WITHDRAWN', 'DISQUALIFIED');
ALTER TABLE "event_class_participant" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "event_school_participant" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "event_stream_participant" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "event_user_participant" ALTER COLUMN "attendance_status" DROP DEFAULT;
ALTER TABLE "event_class_participant" ALTER COLUMN "status" TYPE "participation_status_new" USING ("status"::text::"participation_status_new");
ALTER TABLE "event_school_participant" ALTER COLUMN "status" TYPE "participation_status_new" USING ("status"::text::"participation_status_new");
ALTER TABLE "event_stream_participant" ALTER COLUMN "status" TYPE "participation_status_new" USING ("status"::text::"participation_status_new");
ALTER TABLE "event_user_participant" ALTER COLUMN "attendance_status" TYPE "participation_status_new" USING ("attendance_status"::text::"participation_status_new");
ALTER TYPE "participation_status" RENAME TO "participation_status_old";
ALTER TYPE "participation_status_new" RENAME TO "participation_status";
DROP TYPE "participation_status_old";
ALTER TABLE "event_class_participant" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
ALTER TABLE "event_school_participant" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
ALTER TABLE "event_stream_participant" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';
ALTER TABLE "event_user_participant" ALTER COLUMN "attendance_status" SET DEFAULT 'REGISTERED';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "payment_method_new" AS ENUM ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'MOBILE_MONEY', 'CHEQUE');
ALTER TABLE "payment" ALTER COLUMN "payment_method" TYPE "payment_method_new" USING ("payment_method"::text::"payment_method_new");
ALTER TYPE "payment_method" RENAME TO "payment_method_old";
ALTER TYPE "payment_method_new" RENAME TO "payment_method";
DROP TYPE "payment_method_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "payment_status_new" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
ALTER TABLE "payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payment" ALTER COLUMN "status" TYPE "payment_status_new" USING ("status"::text::"payment_status_new");
ALTER TYPE "payment_status" RENAME TO "payment_status_old";
ALTER TYPE "payment_status_new" RENAME TO "payment_status";
DROP TYPE "payment_status_old";
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "relationship_type_new" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN', 'OTHER');
ALTER TABLE "parent" ALTER COLUMN "relationship_type" TYPE "relationship_type_new" USING ("relationship_type"::text::"relationship_type_new");
ALTER TYPE "relationship_type" RENAME TO "relationship_type_old";
ALTER TYPE "relationship_type_new" RENAME TO "relationship_type";
DROP TYPE "relationship_type_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "reviewable_entity_new" AS ENUM ('SCHOOL', 'SCHOOL_FACILITY', 'EVENT', 'TEACHER');
ALTER TABLE "review" ALTER COLUMN "entity_type" TYPE "reviewable_entity_new" USING ("entity_type"::text::"reviewable_entity_new");
ALTER TYPE "reviewable_entity" RENAME TO "reviewable_entity_old";
ALTER TYPE "reviewable_entity_new" RENAME TO "reviewable_entity";
DROP TYPE "reviewable_entity_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "severity_new" AS ENUM ('EMERGENCY', 'URGENT', 'PRIOTITY', 'INQUIRY', 'LOW');
ALTER TABLE "messages" ALTER COLUMN "severity" TYPE "severity_new" USING ("severity"::text::"severity_new");
ALTER TYPE "severity" RENAME TO "severity_old";
ALTER TYPE "severity_new" RENAME TO "severity";
DROP TYPE "severity_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_class_group_id_fkey";

-- DropForeignKey
ALTER TABLE "fee" DROP CONSTRAINT "fee_semester_id_fkey";

-- DropForeignKey
ALTER TABLE "staff" DROP CONSTRAINT "staff_school_id_fkey";

-- DropIndex
DROP INDEX "fee_fee_type_id_amount_semester_id_key";

-- DropIndex
DROP INDEX "permission_resource_department_id_school_id_class_group_id_idx";

-- DropIndex
DROP INDEX "idx_staff_school_id";

-- AlterTable
ALTER TABLE "event_class_participant" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';

-- AlterTable
ALTER TABLE "event_school_participant" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';

-- AlterTable
ALTER TABLE "event_stream_participant" ALTER COLUMN "status" SET DEFAULT 'REGISTERED';

-- AlterTable
ALTER TABLE "event_user_participant" ALTER COLUMN "attendance_status" SET DEFAULT 'REGISTERED';

-- AlterTable
ALTER TABLE "fee" DROP COLUMN "class_group_id",
DROP COLUMN "name",
DROP COLUMN "semester_id",
ADD COLUMN     "academic_year_for_payment" INTEGER,
ADD COLUMN     "approved_by" INTEGER,
ADD COLUMN     "fee_for" VARCHAR(50),
ADD COLUMN     "for_class" INTEGER,
ADD COLUMN     "for_department" INTEGER,
ADD COLUMN     "for_individual" INTEGER,
ADD COLUMN     "for_school" INTEGER,
ADD COLUMN     "for_stream" INTEGER,
ADD COLUMN     "semester_for_payment" INTEGER;

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "staff" DROP COLUMN "school_id",
ADD COLUMN     "staff_code" TEXT,
ALTER COLUMN "employment_status" SET DEFAULT 'FULL_TIME';

-- CreateIndex
CREATE INDEX "department_school_id_idx" ON "department"("school_id");

-- CreateIndex
CREATE INDEX "fee_semester_for_payment_academic_year_for_payment_idx" ON "fee"("semester_for_payment", "academic_year_for_payment");

-- CreateIndex
CREATE UNIQUE INDEX "fee_fee_type_id_amount_semester_for_payment_academic_year_f_key" ON "fee"("fee_type_id", "amount", "semester_for_payment", "academic_year_for_payment");

-- CreateIndex
CREATE INDEX "medical_user_id_idx" ON "medical"("user_id");

-- CreateIndex
CREATE INDEX "permission_resource_department_id_school_id_class_group_id__idx" ON "permission"("resource", "department_id", "school_id", "class_group_id", "role_id");

-- CreateIndex
CREATE INDEX "staff_department_id_user_id_idx" ON "staff"("department_id", "user_id");

-- CreateIndex
CREATE INDEX "teacher_staff_id_idx" ON "teacher"("staff_id");

-- CreateIndex
CREATE INDEX "users_current_school_role_id_idx" ON "users"("current_school", "role_id");

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_semester_for_payment_fkey" FOREIGN KEY ("semester_for_payment") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_academic_year_for_payment_fkey" FOREIGN KEY ("academic_year_for_payment") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_for_individual_fkey" FOREIGN KEY ("for_individual") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_for_stream_fkey" FOREIGN KEY ("for_stream") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_for_class_fkey" FOREIGN KEY ("for_class") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_for_department_fkey" FOREIGN KEY ("for_department") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_for_school_fkey" FOREIGN KEY ("for_school") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
