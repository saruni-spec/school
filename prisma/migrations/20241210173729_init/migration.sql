-- CreateEnum
CREATE TYPE "attendance_status" AS ENUM ('present', 'absent', 'late', 'excused');

-- CreateEnum
CREATE TYPE "employment_status" AS ENUM ('full_time', 'part_time', 'contract', 'intern', 'temporary');

-- CreateEnum
CREATE TYPE "event_role" AS ENUM ('participant', 'organizer', 'judge', 'supervisor');

-- CreateEnum
CREATE TYPE "event_scope" AS ENUM ('inter_school', 'intra_school', 'class_level', 'stream_level');

-- CreateEnum
CREATE TYPE "exam_type" AS ENUM ('quiz', 'mid_term', 'final', 'assignment');

-- CreateEnum
CREATE TYPE "facility_type" AS ENUM ('Educational', 'Recreational', 'Dining', 'Sports', 'Transportation');

-- CreateEnum
CREATE TYPE "fee_type_enum" AS ENUM ('tuition', 'library', 'sports', 'transport', 'miscellaneous');

-- CreateEnum
CREATE TYPE "participant_type" AS ENUM ('student', 'teacher', 'staff', 'guest');

-- CreateEnum
CREATE TYPE "participation_status" AS ENUM ('registered', 'attended', 'absent', 'withdrawn', 'disqualified');

-- CreateEnum
CREATE TYPE "payment_method" AS ENUM ('cash', 'bank_transfer', 'credit_card', 'mobile_money', 'cheque');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('pending', 'completed', 'failed', 'refunded');

-- CreateEnum
CREATE TYPE "relationship_type" AS ENUM ('father', 'mother', 'guardian', 'other');

-- CreateEnum
CREATE TYPE "reviewable_entity" AS ENUM ('school', 'school_facility', 'event', 'teacher');

-- CreateEnum
CREATE TYPE "grade_level_type" AS ENUM ('PRE_PRIMARY_1', 'PRE_PRIMARY_2', 'GRADE_1', 'GRADE_2', 'GRADE_3', 'GRADE_4', 'GRADE_5', 'GRADE_6', 'GRADE_7', 'GRADE_8', 'GRADE_9', 'GRADE_10', 'GRADE_11', 'GRADE_12');

-- CreateEnum
CREATE TYPE "school_type" AS ENUM ('PRE_PRIMARY', 'LOWER_PRIMARY', 'UPPER_PRIMARY', 'LOWER_SECONDARY', 'UPPER_SECONDARY');

-- CreateEnum
CREATE TYPE "severity" AS ENUM ('emergency', 'urgent', 'priotity', 'inquiry', 'low');

-- CreateEnum
CREATE TYPE "privilege_category" AS ENUM ('SYSTEM_ADMIN', 'EXECUTIVE', 'ADMINISTRATIVE', 'OPERATIONAL', 'SUPERVISORY', 'PERSONAL');

-- CreateEnum
CREATE TYPE "privilege_scope" AS ENUM ('GLOBAL', 'INSTITUTIONAL', 'DEPARTMENTAL', 'PERSONAL');

-- CreateEnum
CREATE TYPE "system_resource" AS ENUM ('SYSTEM', 'INSTITUTION', 'USERS', 'STUDENTS', 'STAFF', 'DEPARTMENTS', 'EVENTS', 'EXAMINATIONS', 'FACILITIES', 'FINANCES', 'MEDICAL', 'LIBRARY', 'ACADEMIC_CLASSES', 'ACADEMIC_STREAMS', 'ADMISSIONS', 'CURRICULUM', 'COMMUNICATION');

-- CreateEnum
CREATE TYPE "role_type" AS ENUM ('SYSTEM_ADMINISTRATOR', 'PRINCIPAL', 'VICE_PRINCIPAL', 'SCHOOL_ADMINISTRATOR', 'HEAD_OF_DEPARTMENT', 'ACADEMIC_REGISTRAR', 'EXAM_CONTROLLER', 'CURRICULUM_COORDINATOR', 'TEACHER', 'CLASS_TEACHER', 'FACULTY_MEMBER', 'ADMINISTRATIVE_STAFF', 'SECRETARY', 'FACILITY_MANAGER', 'FINANCIAL_OFFICER', 'HUMAN_RESOURCES_MANAGER', 'EVENT_COORDINATOR', 'LIBRARIAN', 'ASSISTANT_LIBRARIAN', 'TECHNOLOGY_SUPPORT', 'SECURITY_PERSONNEL', 'ADMISSIONS_OFFICER', 'COUNSELOR', 'MEDICAL_STAFF', 'CHEF', 'STUDENT', 'PARENT', 'AUDIT_OFFICER');

-- CreateTable
CREATE TABLE "school" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "school_type" NOT NULL,
    "address" TEXT,
    "contact_info" JSONB,
    "license_info" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "school_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facility" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "type" "facility_type",
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "school_facility" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "facility_id" INTEGER NOT NULL,
    "description" VARCHAR(100),
    "deleted_at" TIMESTAMPTZ(6),
    "capacity" INTEGER,
    "opening_hours" TIMESTAMP(3),
    "closing_hours" TIMESTAMP(3),
    "overseer" INTEGER NOT NULL,

    CONSTRAINT "school_facility_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "academic_year" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_current" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

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

    CONSTRAINT "semester_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "class" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "grade_level" "grade_level_type" NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stream" (
    "id" SERIAL NOT NULL,
    "class_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "course_material" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "subject_id" INTEGER,
    "description" VARCHAR(100) NOT NULL,

    CONSTRAINT "course_material_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery" (
    "id" SERIAL NOT NULL,
    "created_for" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "picture" (
    "id" SERIAL NOT NULL,
    "picture_location" VARCHAR(50) NOT NULL,
    "taken_by" INTEGER NOT NULL,
    "about" VARCHAR(150) NOT NULL,
    "taken_for" INTEGER NOT NULL,
    "gallery_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "picture_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "department_head" (
    "staff_id" INTEGER NOT NULL,
    "department_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6)
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50),
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "date_of_birth" DATE,
    "address" TEXT,
    "password" TEXT NOT NULL,
    "emergency_contacts" JSONB,
    "role_id" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),
    "current_school" INTEGER,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "notes" VARCHAR(100) NOT NULL,
    "medic_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "medical_pkey" PRIMARY KEY ("id")
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
    "class_id" INTEGER,
    "school_facility_id" INTEGER,
    "stream_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "department_id" INTEGER,
    "user_id" INTEGER NOT NULL,
    "employment_status" "employment_status",
    "qualifications" JSONB,
    "join_date" DATE DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "staff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER,
    "specialization" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" SERIAL NOT NULL,
    "department_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "class_id" INTEGER,
    "code" VARCHAR(20),
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_allocation" (
    "id" SERIAL NOT NULL,
    "teacher_id" INTEGER,
    "subject_id" INTEGER NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "assigned_date" DATE DEFAULT CURRENT_DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "subject_allocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "current_class" INTEGER,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_stream" (
    "student_id" INTEGER NOT NULL,
    "stream_assigment_id" INTEGER NOT NULL,
    "admission_number" VARCHAR(20),
    "admission_date" DATE NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_stream_pkey" PRIMARY KEY ("student_id","stream_assigment_id")
);

-- CreateTable
CREATE TABLE "assignment" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(100) NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER,
    "stream_id" INTEGER,
    "due_date" DATE,

    CONSTRAINT "assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stream_assigment" (
    "id" SERIAL NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stream_assigment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_ellectives" (
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "semester_id" INTEGER NOT NULL,
    "enrollment_date" DATE DEFAULT CURRENT_DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_ellectives_pkey" PRIMARY KEY ("student_id","subject_id")
);

-- CreateTable
CREATE TABLE "parent" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "relationship_type" "relationship_type" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "parent_student" (
    "parent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
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
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "slot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "slot_assignment" (
    "id" SERIAL NOT NULL,
    "slot_id" INTEGER NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "slot_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam" (
    "id" SERIAL NOT NULL,
    "semester_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "type" "exam_type" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "exam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "exam_sitting" (
    "id" SERIAL NOT NULL,
    "exam_id" INTEGER,
    "supervisor" INTEGER,
    "subject_id" INTEGER,
    "stream_id" INTEGER,
    "out_of" DECIMAL(5,2),
    "remarks" TEXT,
    "sitting_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "total_marks" INTEGER NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "exam_sitting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee" (
    "id" SERIAL NOT NULL,
    "fee_type_id" INTEGER,
    "name" VARCHAR(50),
    "amount" DECIMAL(10,2) NOT NULL,
    "due_date" DATE,
    "semester_id" INTEGER NOT NULL,
    "class_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fee_type" (
    "id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "name" "fee_type_enum" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "fee_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcement" (
    "id" SERIAL NOT NULL,
    "announcement" VARCHAR(500),
    "semester_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "date_for" DATE NOT NULL,
    "valid_upto" DATE NOT NULL,
    "scope" "event_scope" NOT NULL,
    "made_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "award" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "semester_id" INTEGER,
    "awarded_by" VARCHAR(100),
    "awared_for" VARCHAR(100),
    "school_id" INTEGER,

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
    "semester_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "created_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_class_participant" (
    "event_id" INTEGER NOT NULL,
    "class_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "participation_status" DEFAULT 'registered',
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_class_participant_pkey" PRIMARY KEY ("event_id","class_id")
);

-- CreateTable
CREATE TABLE "event_school_participant" (
    "event_id" INTEGER NOT NULL,
    "school_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "participation_status" DEFAULT 'registered',
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_school_participant_pkey" PRIMARY KEY ("event_id","school_id")
);

-- CreateTable
CREATE TABLE "event_stream_participant" (
    "event_id" INTEGER NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "status" "participation_status" DEFAULT 'registered',
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_stream_participant_pkey" PRIMARY KEY ("event_id","stream_id")
);

-- CreateTable
CREATE TABLE "event_user_participant" (
    "event_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "participant_type" "participant_type" NOT NULL,
    "registration_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "attendance_status" "participation_status" DEFAULT 'registered',
    "role" "event_role",
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "event_user_participant_pkey" PRIMARY KEY ("event_id","user_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "message_details" VARCHAR(200),
    "topic" VARCHAR(30),
    "severity" "severity",
    "sender" INTEGER,
    "recepient" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "fee_id" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "payment_method" "payment_method" NOT NULL,
    "status" "payment_status" DEFAULT 'pending',
    "reference_number" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "result" (
    "student_id" INTEGER NOT NULL,
    "marked_by" INTEGER,
    "marks_obtained" DECIMAL(5,2),
    "exam_sitting_id" INTEGER NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "result_pkey" PRIMARY KEY ("student_id","exam_sitting_id")
);

-- CreateTable
CREATE TABLE "review" (
    "id" SERIAL NOT NULL,
    "reviewer_id" INTEGER NOT NULL,
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

-- CreateIndex
CREATE UNIQUE INDEX "school_name_key" ON "school"("name");

-- CreateIndex
CREATE UNIQUE INDEX "facility_name_type_key" ON "facility"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "school_facility_school_id_facility_id_key" ON "school_facility"("school_id", "facility_id");

-- CreateIndex
CREATE UNIQUE INDEX "academic_year_school_id_name_key" ON "academic_year"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "semester_academic_year_id_name_key" ON "semester"("academic_year_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "class_school_id_name_key" ON "class"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "stream_class_id_name_key" ON "stream"("class_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "department_school_id_name_key" ON "department"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "department_head_staff_id_department_id_key" ON "department_head"("staff_id", "department_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "medical_description_key" ON "medical"("description");

-- CreateIndex
CREATE UNIQUE INDEX "medical_notes_key" ON "medical"("notes");

-- CreateIndex
CREATE UNIQUE INDEX "role_type_key" ON "role"("type");

-- CreateIndex
CREATE UNIQUE INDEX "role_type_category_key" ON "role"("type", "category");

-- CreateIndex
CREATE INDEX "permission_resource_department_id_school_id_class_id_idx" ON "permission"("resource", "department_id", "school_id", "class_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_role_id_resource_scope_can_admin_can_create_can__key" ON "permission"("role_id", "resource", "scope", "can_admin", "can_create", "can_delete", "can_read", "can_update");

-- CreateIndex
CREATE UNIQUE INDEX "admin_user_id_key" ON "admin"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "staff_user_id_key" ON "staff"("user_id");

-- CreateIndex
CREATE INDEX "idx_staff_school_id" ON "staff"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "teacher_staff_id_key" ON "teacher"("staff_id");

-- CreateIndex
CREATE UNIQUE INDEX "subject_code_key" ON "subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "subject_class_id_name_key" ON "subject"("class_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "subject_allocation_teacher_id_subject_id_key" ON "subject_allocation"("teacher_id", "subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_user_id_key" ON "student"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_stream_admission_number_key" ON "student_stream"("admission_number");

-- CreateIndex
CREATE UNIQUE INDEX "parent_user_id_key" ON "parent"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "slot_day_of_week_start_time_end_time_key" ON "slot"("day_of_week", "start_time", "end_time");

-- CreateIndex
CREATE UNIQUE INDEX "slot_assignment_slot_id_teacher_id_stream_id_key" ON "slot_assignment"("slot_id", "teacher_id", "stream_id");

-- CreateIndex
CREATE UNIQUE INDEX "exam_semester_id_name_type_start_date_key" ON "exam"("semester_id", "name", "type", "start_date");

-- CreateIndex
CREATE UNIQUE INDEX "exam_sitting_stream_id_subject_id_exam_id_sitting_date_key" ON "exam_sitting"("stream_id", "subject_id", "exam_id", "sitting_date");

-- CreateIndex
CREATE UNIQUE INDEX "fee_fee_type_id_amount_semester_id_key" ON "fee"("fee_type_id", "amount", "semester_id");

-- CreateIndex
CREATE UNIQUE INDEX "fee_type_school_id_name_key" ON "fee_type"("school_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "announcement_semester_id_date_for_made_by_scope_key" ON "announcement"("semester_id", "date_for", "made_by", "scope");

-- CreateIndex
CREATE UNIQUE INDEX "award_semester_id_name_key" ON "award"("semester_id", "name");

-- CreateIndex
CREATE INDEX "idx_event_date" ON "event"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_event_scope" ON "event"("scope");

-- CreateIndex
CREATE UNIQUE INDEX "event_semester_id_name_key" ON "event"("semester_id", "name");

-- CreateIndex
CREATE INDEX "idx_event_school_participant" ON "event_school_participant"("event_id", "school_id");

-- CreateIndex
CREATE INDEX "idx_event_user_participant" ON "event_user_participant"("event_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_reference_number_key" ON "payment"("reference_number");

-- CreateIndex
CREATE INDEX "idx_payment_student_id" ON "payment"("student_id");

-- CreateIndex
CREATE INDEX "idx_review_entity_type" ON "review"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "review_reviewer_id_entity_type_title_key" ON "review"("reviewer_id", "entity_type", "title");

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_overseer_fkey" FOREIGN KEY ("overseer") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "lib_book" ADD CONSTRAINT "lib_book_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lib_book" ADD CONSTRAINT "lib_book_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "academic_year" ADD CONSTRAINT "academic_year_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "semester" ADD CONSTRAINT "semester_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "course_material" ADD CONSTRAINT "course_material_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "gallery"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "picture" ADD CONSTRAINT "picture_taken_by_fkey" FOREIGN KEY ("taken_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department_head" ADD CONSTRAINT "department_head_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department_head" ADD CONSTRAINT "department_head_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_school_fkey" FOREIGN KEY ("current_school") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "medical" ADD CONSTRAINT "medical_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject_allocation" ADD CONSTRAINT "subject_allocation_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_current_class_fkey" FOREIGN KEY ("current_class") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_stream" ADD CONSTRAINT "student_stream_stream_assigment_id_fkey" FOREIGN KEY ("stream_assigment_id") REFERENCES "stream_assigment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_stream" ADD CONSTRAINT "student_stream_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "assignment" ADD CONSTRAINT "assignment_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_assigment" ADD CONSTRAINT "stream_assigment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_ellectives" ADD CONSTRAINT "student_ellectives_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "slot_assignment" ADD CONSTRAINT "slot_assignment_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam" ADD CONSTRAINT "exam_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_supervisor_fkey" FOREIGN KEY ("supervisor") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_fee_type_id_fkey" FOREIGN KEY ("fee_type_id") REFERENCES "fee_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_type" ADD CONSTRAINT "fee_type_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_made_by_fkey" FOREIGN KEY ("made_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_school_participant" ADD CONSTRAINT "event_school_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_school_participant" ADD CONSTRAINT "event_school_participant_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_stream_participant" ADD CONSTRAINT "event_stream_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_stream_participant" ADD CONSTRAINT "event_stream_participant_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_user_participant" ADD CONSTRAINT "event_user_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_user_participant" ADD CONSTRAINT "event_user_participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recepient_fkey" FOREIGN KEY ("recepient") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_fee_id_fkey" FOREIGN KEY ("fee_id") REFERENCES "fee"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_exam_sitting_id_fkey" FOREIGN KEY ("exam_sitting_id") REFERENCES "exam_sitting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_marked_by_fkey" FOREIGN KEY ("marked_by") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
