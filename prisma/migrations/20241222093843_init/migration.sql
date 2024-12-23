-- CreateEnum
CREATE TYPE "attendance_status" AS ENUM ('PRESENT', 'ABSENT', 'LATE', 'EXCUSED');

-- CreateEnum
CREATE TYPE "absence_reason" AS ENUM ('MEDICAL', 'PERSONAL', 'SCHOOL_RELATED');

-- CreateEnum
CREATE TYPE "installment_types" AS ENUM ('SINGLE_PAYMENT', 'WEEKLY', 'MONTHLY', 'SEMESTER', 'ANNUAL', 'EMERGENCY');

-- CreateEnum
CREATE TYPE "employment_status" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN', 'TEMPORARY', 'NONE');

-- CreateEnum
CREATE TYPE "event_role" AS ENUM ('PARTICIPANT', 'ORGANIZER', 'JUDGE', 'SUPERVISOR');

-- CreateEnum
CREATE TYPE "event_scope" AS ENUM ('INTER_SCHOOL', 'INTRA_SCHOOL', 'class_progression', 'GRADE', 'DEPARTMENT', 'STREAM_LEVEL', 'INDIVIDUAL');

-- CreateEnum
CREATE TYPE "award_type" AS ENUM ('ACADEMIC_ACHIEVEMENT', 'SPORTS', 'INNOVATION', 'HUMANITARIAN', 'DILIGENCE', 'COMMUNICATION', 'PARTICIPATION', 'CREATIVITY');

-- CreateEnum
CREATE TYPE "exam_type" AS ENUM ('QUIZ', 'MID_TERM', 'FINAL', 'ASSIGNMENT');

-- CreateEnum
CREATE TYPE "facility_type" AS ENUM ('EDUCATIONAL', 'RECREATIONAL', 'DINING', 'SPORTS', 'TRANSPORTATION', 'MEDICAL');

-- CreateEnum
CREATE TYPE "fee_type_enum" AS ENUM ('TUITION', 'LIBRARY', 'SPORTS', 'TRANSPORT', 'FACILITY', 'DEVELOPMENT', 'COURSE_MATERIAL', 'STATIONERY', 'UNIFORM', 'MEDICAL', 'CULINARY', 'LAB', 'EVENT_PARTIPATION', 'DAMAGE', 'FINE', 'MISCELLANEOUS');

-- CreateEnum
CREATE TYPE "participant_type" AS ENUM ('STUDENT', 'TEACHER', 'STAFF', 'GUEST', 'GUARDIAN');

-- CreateEnum
CREATE TYPE "participation_status" AS ENUM ('REGISTERED', 'ATTENDED', 'ABSENT', 'WITHDRAWN', 'DISQUALIFIED');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('CASH', 'BANK_TRANSFER', 'CREDIT_CARD', 'MOBILE_MONEY', 'CHEQUE');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED', 'OVERPAID');

-- CreateEnum
CREATE TYPE "relationship_type" AS ENUM ('FATHER', 'MOTHER', 'GUARDIAN', 'OTHER');

-- CreateEnum
CREATE TYPE "reviewable_entity" AS ENUM ('SCHOOL', 'SCHOOL_FACILITY', 'EVENT', 'TEACHER');

-- CreateEnum
CREATE TYPE "grade_level_type" AS ENUM ('PRE_PRIMARY_1', 'PRE_PRIMARY_2', 'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12');

-- CreateEnum
CREATE TYPE "school_type" AS ENUM ('PRE_PRIMARY', 'LOWER_PRIMARY', 'UPPER_PRIMARY', 'LOWER_SECONDARY', 'UPPER_SECONDARY');

-- CreateEnum
CREATE TYPE "severity" AS ENUM ('EMERGENCY', 'URGENT', 'PRIOTITY', 'INQUIRY', 'LOW');

-- CreateEnum
CREATE TYPE "privilege_category" AS ENUM ('SYSTEM_ADMIN', 'EXECUTIVE', 'ADMINISTRATIVE', 'OPERATIONAL', 'SUPERVISORY', 'PERSONAL');

-- CreateEnum
CREATE TYPE "privilege_scope" AS ENUM ('GLOBAL', 'INSTITUTIONAL', 'DEPARTMENTAL', 'PERSONAL');

-- CreateEnum
CREATE TYPE "system_resource" AS ENUM ('SYSTEM', 'INSTITUTION', 'USERS', 'STUDENTS', 'STAFF', 'DEPARTMENTS', 'EVENTS', 'EXAMINATIONS', 'FACILITIES', 'FINANCES', 'MEDICAL', 'LIBRARY', 'ACADEMIC_CLASSES', 'ACADEMIC_STREAMS', 'ADMISSIONS', 'CURRICULUM', 'COMMUNICATION');

-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('SYSTEM_ADMINISTRATOR', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SCHOOL_ADMINISTRATOR', 'HEAD_OF_DEPARTMENT', 'ACADEMIC_REGISTRAR', 'EXAM_CONTROLLER', 'CURRICULUM_COORDINATOR', 'TEACHER', 'CLASS_TEACHER', 'FACULTY_MEMBER', 'ADMINISTRATIVE_STAFF', 'SECRETARY', 'FACILITY_MANAGER', 'FINANCIAL_OFFICER', 'HUMAN_RESOURCES_MANAGER', 'EVENT_COORDINATOR', 'LIBRARIAN', 'ASSISTANT_LIBRARIAN', 'TECHNOLOGY_SUPPORT', 'SECURITY_PERSONNEL', 'ADMISSIONS_OFFICER', 'COUNSELOR', 'MEDICAL_STAFF', 'CHEF', 'STUDENT', 'PARENT', 'AUDIT_OFFICER');

-- CreateEnum
CREATE TYPE "domain_specific_roles" AS ENUM ('MEMBER', 'REPRESENTATIVE', 'ASSISTANT_REPRESENTATIVE');

-- CreateEnum
CREATE TYPE "picture_category" AS ENUM ('EVENT', 'DOCUMENT', 'CLASSROOM', 'FINANCIAL', 'STUDENT_WORK', 'FACILITY', 'EXTRACURRICULAR', 'ADMINISTRATIVE', 'ACHIEVEMENT', 'MISCELLANEOUS', 'EDUCATIONAL', 'LOST_AND_FOUND');

-- CreateEnum
CREATE TYPE "gallery_type" AS ENUM ('EVENT', 'SCHOOL', 'DEPARTMENT', 'CLASS', 'STUDENT', 'STAFF', 'ADMINISTRATIVE', 'FACILITY', 'FINANCE', 'ACHIEVEMENTS', 'MISCELLANEOUS');

-- CreateEnum
CREATE TYPE "gallery_visibility" AS ENUM ('PRIVATE', 'INTERNAL', 'PUBLIC');

-- CreateTable
CREATE TABLE "school" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "address" TEXT,
    "contact_info" JSONB,
    "license_info" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "levels_offered" (
    "school_id" INTEGER NOT NULL,
    "school_level_id" INTEGER NOT NULL,

    CONSTRAINT "levels_offered_pkey" PRIMARY KEY ("school_id","school_level_id")
);

-- CreateTable
CREATE TABLE "school_level" (
    "id" SERIAL NOT NULL,
    "type" "school_type" NOT NULL,

    CONSTRAINT "school_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "type" "facility_type" NOT NULL,
    "description" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_facility" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "facility_id" INTEGER,
    "capacity" INTEGER,
    "description" VARCHAR(100),
    "justification" VARCHAR(100),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "opening_hours" TIMESTAMP(3),
    "closing_hours" TIMESTAMP(3),

    CONSTRAINT "school_facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "academic_year" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "year" VARCHAR(50) NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "is_current" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "academic_year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "semester" (
    "id" SERIAL NOT NULL,
    "academic_year_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_current" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility_staff" (
    "staff_id" INTEGER NOT NULL,
    "school_facility_id" INTEGER NOT NULL,
    "role" "role_type",
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "facility_staff_pkey" PRIMARY KEY ("staff_id","school_facility_id")
);

-- CreateTable
CREATE TABLE "grade_level" (
    "id" SERIAL NOT NULL,
    "level" "grade_level_type" NOT NULL,
    "school_level_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "grade_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stream" (
    "id" SERIAL NOT NULL,
    "grade_level_id" INTEGER,
    "school_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "is_current" BOOLEAN,
    "academic_year_id" INTEGER,
    "stream_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_class" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "class_progression_id" INTEGER,
    "student_role" "domain_specific_roles" DEFAULT 'MEMBER',
    "admission_date" DATE,
    "start_date" DATE,
    "end_date" DATE,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER,
    "staff_id" INTEGER,
    "class_progression_id" INTEGER,
    "taken_on" TIMESTAMP(3),
    "status" "attendance_status",
    "reason_for_absence" "absence_reason",
    "notified_on" TIMESTAMP(3),
    "to_miss_on" TIMESTAMP(3),
    "up_to" TIMESTAMP(3),
    "school_leader_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "resource" "system_resource" NOT NULL,
    "scope" "privilege_scope" NOT NULL DEFAULT 'DEPARTMENTAL',
    "can_admin" BOOLEAN NOT NULL DEFAULT false,
    "can_create" BOOLEAN NOT NULL DEFAULT false,
    "can_read" BOOLEAN NOT NULL DEFAULT false,
    "can_update" BOOLEAN NOT NULL DEFAULT false,
    "can_delete" BOOLEAN NOT NULL DEFAULT false,
    "department_id" INTEGER,
    "school_id" INTEGER,
    "class_progression_id" INTEGER,
    "school_facility_id" INTEGER,
    "stream_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "id_code" VARCHAR(30),
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "date_of_birth" DATE,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "emergency_contacts" JSONB,
    "role_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "school_id" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "type" "role_type" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" "privilege_category",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_leader" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER,
    "academic_year_id" INTEGER,
    "date_removed" DATE,
    "reason_removed" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "school_leader_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER NOT NULL,
    "school_code" VARCHAR(20),
    "department_id" INTEGER,
    "employment_status" "employment_status" NOT NULL DEFAULT 'FULL_TIME',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "admission_number" VARCHAR(20),
    "student_code" VARCHAR(20),
    "users_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_grade" (
    "id" SERIAL NOT NULL,
    "subject_id" INTEGER,
    "grade_level_id" INTEGER,
    "name" TEXT,
    "description" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "subject_grade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_allocation" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER,
    "teacher_id" INTEGER,
    "subject_grade_id" INTEGER,
    "stream_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "assigned_date" DATE DEFAULT CURRENT_DATE,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "subject_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "notes" VARCHAR(100) NOT NULL,
    "medic_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "medical_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_allocation_id" INTEGER,
    "class_progression_id" INTEGER,
    "due_date" DATE,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assignment_attempt" (
    "id" SERIAL NOT NULL,
    "assignment_id" INTEGER,
    "student_id" INTEGER,
    "date_submitted" TIMESTAMP(3),
    "date_marked" TIMESTAMP(3),
    "teacher_id" INTEGER,
    "result" DECIMAL(5,2),
    "assessment" VARCHAR(30),
    "remarks" VARCHAR(50),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "assignment_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_ellectives" (
    "student_id" INTEGER NOT NULL,
    "subject_allocation_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "enrollment_date" DATE DEFAULT CURRENT_DATE,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_ellectives_pkey" PRIMARY KEY ("student_id","subject_allocation_id")
);

-- CreateTable
CREATE TABLE "parent" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER,
    "relationship_type" "relationship_type" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_student" (
    "parent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "parent_student_pkey" PRIMARY KEY ("parent_id","student_id")
);

-- CreateTable
CREATE TABLE "slot" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "room_number" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_assignment" (
    "id" SERIAL NOT NULL,
    "slot_id" INTEGER NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_allocation_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "slot_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam" (
    "id" SERIAL NOT NULL,
    "semester_id" INTEGER,
    "name" VARCHAR(30) NOT NULL,
    "exam_providers" VARCHAR(30),
    "start_date" DATE,
    "end_date" DATE,
    "type" "exam_type" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_sitting" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER,
    "teacher_id" INTEGER,
    "subject_allocation_id" INTEGER,
    "stream_id" INTEGER,
    "out_of" DECIMAL(5,2),
    "remarks" TEXT,
    "sitting_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "total_marks" INTEGER NOT NULL,

    CONSTRAINT "exam_sitting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_payee" (
    "id" SERIAL NOT NULL,
    "fee_id" INTEGER,
    "users_id" INTEGER,
    "stream_id" INTEGER,
    "department_id" INTEGER,
    "whole_school" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "fee_payee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "fee_for" "fee_type_enum" NOT NULL,
    "description" VARCHAR(100),
    "school_leader_id" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "installments" "installment_types" NOT NULL,
    "due_date" DATE,
    "school_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER,
    "fee_payee_id" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "over_payment" DECIMAL(10,2),
    "payment_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "payment_method" "payment_method" NOT NULL,
    "status" "payment_status" DEFAULT 'PENDING',
    "reference_number" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement" (
    "id" SERIAL NOT NULL,
    "announcement" VARCHAR(500),
    "date_for" DATE NOT NULL,
    "valid_upto" DATE NOT NULL,
    "scope" "event_scope" NOT NULL,
    "users_id" INTEGER,
    "school_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20),
    "description" TEXT,
    "semester_id" INTEGER,
    "awarded_by" VARCHAR(20),
    "type" "award_type" NOT NULL,
    "awared_for" VARCHAR(100),
    "users_id" INTEGER,
    "class_progression_id" INTEGER,
    "department_id" INTEGER,
    "school_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "award_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "location" VARCHAR(200),
    "start_date" TIMESTAMPTZ(6) NOT NULL,
    "end_date" TIMESTAMPTZ(6) NOT NULL,
    "scope" "event_scope" NOT NULL,
    "users_id" INTEGER,
    "school_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_class_participant" (
    "event_id" INTEGER NOT NULL,
    "class_progression_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "participation_status" DEFAULT 'REGISTERED',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_class_participant_pkey" PRIMARY KEY ("event_id","class_progression_id")
);

-- CreateTable
CREATE TABLE "event_school_participant" (
    "event_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "participation_status" DEFAULT 'REGISTERED',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_school_participant_pkey" PRIMARY KEY ("event_id","school_id")
);

-- CreateTable
CREATE TABLE "event_department_participant" (
    "event_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "participation_status" DEFAULT 'REGISTERED',
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_department_participant_pkey" PRIMARY KEY ("event_id","department_id")
);

-- CreateTable
CREATE TABLE "event_user_participant" (
    "event_id" INTEGER NOT NULL,
    "users_id" INTEGER NOT NULL,
    "participant_type" "participant_type" NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "attendance_status" "participation_status" DEFAULT 'REGISTERED',
    "role" "event_role",
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_user_participant_pkey" PRIMARY KEY ("event_id","users_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "message_details" VARCHAR(200),
    "topic" VARCHAR(30),
    "severity" "severity",
    "sender" INTEGER,
    "recepient" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result" (
    "student_id" INTEGER NOT NULL,
    "teacher_id" INTEGER,
    "marks_obtained" DECIMAL(5,2),
    "exam_sitting_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "result_pkey" PRIMARY KEY ("student_id","exam_sitting_id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "users_id" INTEGER,
    "entity_type" "reviewable_entity" NOT NULL,
    "school_id" INTEGER,
    "school_facility_id" INTEGER,
    "event_id" INTEGER,
    "teacher_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "title" VARCHAR(100),
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_material" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "users_id" INTEGER,
    "school_id" INTEGER,
    "subject_id" INTEGER,
    "grade_level" "grade_level_type" NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "file_path" VARCHAR(50) NOT NULL,
    "topic" VARCHAR(30) NOT NULL,

    CONSTRAINT "course_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type" "gallery_type" NOT NULL,
    "visibility" "gallery_visibility" NOT NULL DEFAULT 'INTERNAL',
    "category" "picture_category" NOT NULL,
    "school_id" INTEGER,
    "location" VARCHAR(255),
    "users_id" INTEGER,
    "tags" VARCHAR(50)[],
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picture" (
    "id" SERIAL NOT NULL,
    "gallery_id" INTEGER,
    "title" VARCHAR(255),
    "file_path" VARCHAR(500) NOT NULL,
    "file_name" VARCHAR(255) NOT NULL,
    "file_size" INTEGER NOT NULL,
    "mime_type" VARCHAR(100) NOT NULL,
    "taken_at" TIMESTAMPTZ(6),
    "uploaded_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tags" VARCHAR(50)[],
    "users_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "picture_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lib_book" (
    "id" SERIAL NOT NULL,
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

    CONSTRAINT "lib_book_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "school_name_key" ON "school"("name");

-- CreateIndex
CREATE UNIQUE INDEX "school_level_type_key" ON "school_level"("type");

-- CreateIndex
CREATE UNIQUE INDEX "facility_name_type_key" ON "facility"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "school_facility_school_id_facility_id_capacity_key" ON "school_facility"("school_id", "facility_id", "capacity");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_school_id_year_key" ON "academic_year"("school_id", "year");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_school_id_start_date_key" ON "academic_year"("school_id", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "semester_academic_year_id_start_date_key" ON "semester"("academic_year_id", "start_date");

-- CreateIndex
CREATE INDEX "department_school_id_idx" ON "department"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_school_id_name_key" ON "department"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "grade_level_level_key" ON "grade_level"("level");

-- CreateIndex
CREATE INDEX "stream_school_id_idx" ON "stream"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "stream_grade_level_id_name_school_id_key" ON "stream"("grade_level_id", "name", "school_id");

-- CreateIndex
CREATE INDEX "class_academic_year_id_idx" ON "class"("academic_year_id");

-- CreateIndex
CREATE INDEX "class_is_current_idx" ON "class"("is_current");

-- CreateIndex
CREATE UNIQUE INDEX "class_stream_id_academic_year_id_key" ON "class"("stream_id", "academic_year_id");

-- CreateIndex
CREATE INDEX "student_class_student_id_idx" ON "student_class"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_class_student_id_class_progression_id_key" ON "student_class"("student_id", "class_progression_id");

-- CreateIndex
CREATE INDEX "attendance_users_id_idx" ON "attendance"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "attendance_users_id_created_at_key" ON "attendance"("users_id", "created_at");

-- CreateIndex
CREATE INDEX "permission_resource_department_id_school_id_class_progressi_idx" ON "permission"("resource", "department_id", "school_id", "class_progression_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_role_id_resource_scope_can_admin_can_create_can__key" ON "permission"("role_id", "resource", "scope", "can_admin", "can_create", "can_delete", "can_read", "can_update");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_code_key" ON "users"("id_code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_school_id_idx" ON "users"("school_id");

-- CreateIndex
CREATE INDEX "users_role_id_idx" ON "users"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "role_type_key" ON "role"("type");

-- CreateIndex
CREATE UNIQUE INDEX "role_type_category_key" ON "role"("type", "category");

-- CreateIndex
CREATE UNIQUE INDEX "school_leader_staff_id_key" ON "school_leader"("staff_id");

-- CreateIndex
CREATE INDEX "school_leader_academic_year_id_idx" ON "school_leader"("academic_year_id");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_id_key" ON "admin"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_users_id_key" ON "staff"("users_id");

-- CreateIndex
CREATE INDEX "staff_users_id_idx" ON "staff"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_staff_id_key" ON "teacher"("staff_id");

-- CreateIndex
CREATE INDEX "teacher_staff_id_idx" ON "teacher"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_student_code_key" ON "student"("student_code");

-- CreateIndex
CREATE UNIQUE INDEX "student_users_id_key" ON "student"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_name_key" ON "subject"("name");

-- CreateIndex
CREATE UNIQUE INDEX "subject_grade_grade_level_id_subject_id_key" ON "subject_grade"("grade_level_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_allocation_teacher_id_subject_grade_id_key" ON "subject_allocation"("teacher_id", "subject_grade_id");

-- CreateIndex
CREATE UNIQUE INDEX "medical_description_key" ON "medical"("description");

-- CreateIndex
CREATE UNIQUE INDEX "medical_notes_key" ON "medical"("notes");

-- CreateIndex
CREATE INDEX "medical_users_id_idx" ON "medical"("users_id");

-- CreateIndex
CREATE INDEX "assignment_class_progression_id_idx" ON "assignment"("class_progression_id");

-- CreateIndex
CREATE INDEX "assignment_subject_allocation_id_idx" ON "assignment"("subject_allocation_id");

-- CreateIndex
CREATE INDEX "assignment_attempt_assignment_id_idx" ON "assignment_attempt"("assignment_id");

-- CreateIndex
CREATE INDEX "assignment_attempt_date_submitted_idx" ON "assignment_attempt"("date_submitted");

-- CreateIndex
CREATE UNIQUE INDEX "parent_users_id_key" ON "parent"("users_id");

-- CreateIndex
CREATE UNIQUE INDEX "slot_day_of_week_start_time_end_time_room_number_key" ON "slot"("day_of_week", "start_time", "end_time", "room_number");

-- CreateIndex
CREATE INDEX "slot_assignment_teacher_id_idx" ON "slot_assignment"("teacher_id");

-- CreateIndex
CREATE INDEX "slot_assignment_subject_allocation_id_idx" ON "slot_assignment"("subject_allocation_id");

-- CreateIndex
CREATE UNIQUE INDEX "slot_assignment_slot_id_teacher_id_stream_id_key" ON "slot_assignment"("slot_id", "teacher_id", "stream_id");

-- CreateIndex
CREATE INDEX "exam_start_date_idx" ON "exam"("start_date");

-- CreateIndex
CREATE UNIQUE INDEX "exam_semester_id_name_type_start_date_key" ON "exam"("semester_id", "name", "type", "start_date");

-- CreateIndex
CREATE INDEX "exam_sitting_sitting_date_idx" ON "exam_sitting"("sitting_date");

-- CreateIndex
CREATE UNIQUE INDEX "exam_sitting_stream_id_subject_allocation_id_exam_id_sittin_key" ON "exam_sitting"("stream_id", "subject_allocation_id", "exam_id", "sitting_date");

-- CreateIndex
CREATE INDEX "fee_payee_fee_id_idx" ON "fee_payee"("fee_id");

-- CreateIndex
CREATE INDEX "fee_due_date_idx" ON "fee"("due_date");

-- CreateIndex
CREATE UNIQUE INDEX "fee_fee_for_amount_due_date_key" ON "fee"("fee_for", "amount", "due_date");

-- CreateIndex
CREATE UNIQUE INDEX "payment_reference_number_key" ON "payment"("reference_number");

-- CreateIndex
CREATE INDEX "payment_users_id_idx" ON "payment"("users_id");

-- CreateIndex
CREATE INDEX "payment_payment_method_idx" ON "payment"("payment_method");

-- CreateIndex
CREATE INDEX "payment_status_idx" ON "payment"("status");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_school_id_date_for_users_id_scope_valid_upto_key" ON "announcement"("school_id", "date_for", "users_id", "scope", "valid_upto");

-- CreateIndex
CREATE UNIQUE INDEX "award_semester_id_name_key" ON "award"("semester_id", "name");

-- CreateIndex
CREATE INDEX "idx_event_date" ON "event"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_event_scope" ON "event"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "event_name_start_date_school_id_key" ON "event"("name", "start_date", "school_id");

-- CreateIndex
CREATE INDEX "idx_event_school_participant" ON "event_school_participant"("event_id", "school_id");

-- CreateIndex
CREATE INDEX "idx_event_user_participant" ON "event_user_participant"("event_id", "users_id");

-- CreateIndex
CREATE INDEX "messages_sender_idx" ON "messages"("sender");

-- CreateIndex
CREATE INDEX "messages_recepient_idx" ON "messages"("recepient");

-- CreateIndex
CREATE INDEX "result_student_id_idx" ON "result"("student_id");

-- CreateIndex
CREATE INDEX "idx_review_entity_type" ON "review"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "review_users_id_entity_type_title_key" ON "review"("users_id", "entity_type", "title");

-- CreateIndex
CREATE INDEX "course_material_topic_idx" ON "course_material"("topic");

-- CreateIndex
CREATE INDEX "course_material_subject_id_idx" ON "course_material"("subject_id");

-- CreateIndex
CREATE INDEX "gallery_type_idx" ON "gallery"("type");

-- CreateIndex
CREATE INDEX "gallery_visibility_idx" ON "gallery"("visibility");

-- CreateIndex
CREATE INDEX "picture_gallery_id_idx" ON "picture"("gallery_id");

-- CreateIndex
CREATE INDEX "picture_taken_at_idx" ON "picture"("taken_at");

-- CreateIndex
CREATE INDEX "picture_uploaded_at_idx" ON "picture"("uploaded_at");

-- AddForeignKey
ALTER TABLE "levels_offered" ADD CONSTRAINT "levels_offered_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "levels_offered" ADD CONSTRAINT "levels_offered_school_level_id_fkey" FOREIGN KEY ("school_level_id") REFERENCES "school_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_year" ADD CONSTRAINT "academic_year_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "semester" ADD CONSTRAINT "semester_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_staff" ADD CONSTRAINT "facility_staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facility_staff" ADD CONSTRAINT "facility_staff_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "grade_level" ADD CONSTRAINT "grade_level_school_level_id_fkey" FOREIGN KEY ("school_level_id") REFERENCES "school_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_grade_level_id_fkey" FOREIGN KEY ("grade_level_id") REFERENCES "grade_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_class" ADD CONSTRAINT "student_class_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_school_leader_id_fkey" FOREIGN KEY ("school_leader_id") REFERENCES "school_leader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_leader" ADD CONSTRAINT "school_leader_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "school_leader" ADD CONSTRAINT "school_leader_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_grade" ADD CONSTRAINT "subject_grade_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_grade" ADD CONSTRAINT "subject_grade_grade_level_id_fkey" FOREIGN KEY ("grade_level_id") REFERENCES "grade_level"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_subject_grade_id_fkey" FOREIGN KEY ("subject_grade_id") REFERENCES "subject_grade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical" ADD CONSTRAINT "medical_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_attempt" ADD CONSTRAINT "assignment_attempt_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_attempt" ADD CONSTRAINT "assignment_attempt_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment_attempt" ADD CONSTRAINT "assignment_attempt_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "assignment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam" ADD CONSTRAINT "exam_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_subject_allocation_id_fkey" FOREIGN KEY ("subject_allocation_id") REFERENCES "subject_allocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee_payee" ADD CONSTRAINT "fee_payee_fee_id_fkey" FOREIGN KEY ("fee_id") REFERENCES "fee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_school_leader_id_fkey" FOREIGN KEY ("school_leader_id") REFERENCES "school_leader"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_fee_payee_id_fkey" FOREIGN KEY ("fee_payee_id") REFERENCES "fee_payee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_class_progression_id_fkey" FOREIGN KEY ("class_progression_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_school_participant" ADD CONSTRAINT "event_school_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_school_participant" ADD CONSTRAINT "event_school_participant_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_department_participant" ADD CONSTRAINT "event_department_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_department_participant" ADD CONSTRAINT "event_department_participant_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_user_participant" ADD CONSTRAINT "event_user_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_user_participant" ADD CONSTRAINT "event_user_participant_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recepient_fkey" FOREIGN KEY ("recepient") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_exam_sitting_id_fkey" FOREIGN KEY ("exam_sitting_id") REFERENCES "exam_sitting"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_material" ADD CONSTRAINT "course_material_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_material" ADD CONSTRAINT "course_material_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "course_material" ADD CONSTRAINT "course_material_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "gallery"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_users_id_fkey" FOREIGN KEY ("users_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lib_book" ADD CONSTRAINT "lib_book_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lib_book" ADD CONSTRAINT "lib_book_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;
