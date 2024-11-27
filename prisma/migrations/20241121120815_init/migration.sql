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
CREATE TYPE "facility_type" AS ENUM ('library', 'lab', 'sports_field', 'canteen', 'swimming_pool', 'transport');

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
CREATE TYPE "school_type" AS ENUM ('primary', 'secondary', 'combined');

-- CreateEnum
CREATE TYPE "severity" AS ENUM ('emergency', 'urgent', 'priotity', 'inquiry', 'low');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('admin', 'teacher', 'staff', 'student', 'parent');

-- CreateTable
CREATE TABLE "academic_year" (
    "academic_year_id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_current" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "academic_year_pkey" PRIMARY KEY ("academic_year_id")
);

-- CreateTable
CREATE TABLE "announcement" (
    "announcement_id" SERIAL NOT NULL,
    "announcement" VARCHAR(500),
    "semester_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "date_for" DATE NOT NULL,
    "valid_upto" DATE NOT NULL,
    "scope" "event_scope" NOT NULL,
    "made_by" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "announcement_pkey" PRIMARY KEY ("announcement_id")
);

-- CreateTable
CREATE TABLE "award" (
    "award_id" SERIAL NOT NULL,
    "name" VARCHAR(100),
    "semester_id" INTEGER,
    "awarded_by" VARCHAR(100),
    "awared_for" VARCHAR(100),
    "school_id" INTEGER,

    CONSTRAINT "award_pkey" PRIMARY KEY ("award_id")
);

-- CreateTable
CREATE TABLE "class" (
    "class_id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "teacher_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "grade_level" INTEGER NOT NULL,
    "academic_year_id" INTEGER,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "class_pkey" PRIMARY KEY ("class_id")
);

-- CreateTable
CREATE TABLE "department" (
    "department_id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "head_of_department" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "department_pkey" PRIMARY KEY ("department_id")
);

-- CreateTable
CREATE TABLE "event" (
    "event_id" SERIAL NOT NULL,
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

    CONSTRAINT "event_pkey" PRIMARY KEY ("event_id")
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
CREATE TABLE "exam" (
    "exam_id" SERIAL NOT NULL,
    "semester_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "type" "exam_type" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "exam_pkey" PRIMARY KEY ("exam_id")
);

-- CreateTable
CREATE TABLE "exam_sitting" (
    "exam_sitting_id" SERIAL NOT NULL,
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

    CONSTRAINT "exam_sitting_pkey" PRIMARY KEY ("exam_sitting_id")
);

-- CreateTable
CREATE TABLE "facility" (
    "facility_id" SERIAL NOT NULL,
    "facility_name" VARCHAR(50),
    "type" "facility_type",
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "facility_pkey" PRIMARY KEY ("facility_id")
);

-- CreateTable
CREATE TABLE "fee" (
    "fee_id" SERIAL NOT NULL,
    "fee_type_id" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "due_date" DATE,
    "academic_year_id" INTEGER,
    "class_id" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "fee_pkey" PRIMARY KEY ("fee_id")
);

-- CreateTable
CREATE TABLE "fee_type" (
    "fee_type_id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "name" "fee_type_enum" NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "fee_type_pkey" PRIMARY KEY ("fee_type_id")
);

-- CreateTable
CREATE TABLE "messages" (
    "message_id" SERIAL NOT NULL,
    "message_details" VARCHAR(200),
    "topic" VARCHAR(30),
    "severity" "severity",
    "sender" INTEGER,
    "recepient" INTEGER,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "messages_pkey" PRIMARY KEY ("message_id")
);

-- CreateTable
CREATE TABLE "parent" (
    "parent_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "relationship_type" "relationship_type" NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "parent_pkey" PRIMARY KEY ("parent_id")
);

-- CreateTable
CREATE TABLE "parent_student" (
    "parent_id" INTEGER NOT NULL,
    "student_id" INTEGER NOT NULL,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "parent_student_pkey" PRIMARY KEY ("parent_id","student_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "student_id" INTEGER,
    "fee_id" INTEGER,
    "amount" DECIMAL(10,2) NOT NULL,
    "payment_date" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "payment_method" "payment_method" NOT NULL,
    "status" "payment_status" DEFAULT 'pending',
    "reference_number" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
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
    "review_id" SERIAL NOT NULL,
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

    CONSTRAINT "review_pkey" PRIMARY KEY ("review_id")
);

-- CreateTable
CREATE TABLE "school" (
    "school_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "school_type" NOT NULL,
    "address" TEXT,
    "contact_info" JSONB,
    "license_info" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "school_pkey" PRIMARY KEY ("school_id")
);

-- CreateTable
CREATE TABLE "school_facility" (
    "school_id" INTEGER,
    "facility_id" INTEGER,
    "notes" VARCHAR(100),
    "deleted_at" TIMESTAMPTZ(6)
);

-- CreateTable
CREATE TABLE "semester" (
    "semester_id" SERIAL NOT NULL,
    "academic_year_id" INTEGER,
    "name" VARCHAR(50) NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "is_current" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "semester_pkey" PRIMARY KEY ("semester_id")
);

-- CreateTable
CREATE TABLE "staff" (
    "staff_id" SERIAL NOT NULL,
    "school_id" INTEGER,
    "department_id" INTEGER,
    "user_id" INTEGER,
    "employment_status" "employment_status",
    "qualifications" JSONB,
    "join_date" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "staff_pkey" PRIMARY KEY ("staff_id")
);

-- CreateTable
CREATE TABLE "stream" (
    "stream_id" SERIAL NOT NULL,
    "class_id" INTEGER,
    "stream_name" VARCHAR(50) NOT NULL,
    "capacity" INTEGER,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "stream_pkey" PRIMARY KEY ("stream_id")
);

-- CreateTable
CREATE TABLE "student" (
    "student_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "date_of_birth" DATE NOT NULL,
    "medical_info" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_pkey" PRIMARY KEY ("student_id")
);

-- CreateTable
CREATE TABLE "student_school" (
    "student_id" INTEGER NOT NULL,
    "stream_id" INTEGER NOT NULL,
    "admission_number" VARCHAR(20),
    "admission_date" DATE NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_school_pkey" PRIMARY KEY ("student_id","stream_id")
);

-- CreateTable
CREATE TABLE "student_subject" (
    "student_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "academic_year_id" INTEGER NOT NULL,
    "enrollment_date" DATE DEFAULT CURRENT_DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "student_subject_pkey" PRIMARY KEY ("student_id","subject_id","academic_year_id")
);

-- CreateTable
CREATE TABLE "subject" (
    "subject_id" SERIAL NOT NULL,
    "department_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "subject_pkey" PRIMARY KEY ("subject_id")
);

-- CreateTable
CREATE TABLE "teacher" (
    "teacher_id" SERIAL NOT NULL,
    "staff_id" INTEGER,
    "specialization" VARCHAR(100),
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "teacher_pkey" PRIMARY KEY ("teacher_id")
);

-- CreateTable
CREATE TABLE "teacher_subject" (
    "teacher_id" INTEGER NOT NULL,
    "subject_id" INTEGER NOT NULL,
    "assigned_date" DATE DEFAULT CURRENT_DATE,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "teacher_subject_pkey" PRIMARY KEY ("teacher_id","subject_id")
);

-- CreateTable
CREATE TABLE "timetable_slot" (
    "slot_id" SERIAL NOT NULL,
    "class_id" INTEGER,
    "subject_id" INTEGER,
    "teacher_id" INTEGER,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TIME(6) NOT NULL,
    "end_time" TIME(6) NOT NULL,
    "room_number" VARCHAR(20),
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "timetable_slot_pkey" PRIMARY KEY ("slot_id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "phone" VARCHAR(20),
    "address" TEXT,
    "role" "user_role" NOT NULL,
    "password_hash" TEXT NOT NULL,
    "emergency_contacts" JSONB,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateIndex
CREATE INDEX "idx_event_date" ON "event"("start_date", "end_date");

-- CreateIndex
CREATE INDEX "idx_event_scope" ON "event"("scope");

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
CREATE INDEX "idx_staff_school_id" ON "staff"("school_id");

-- CreateIndex
CREATE UNIQUE INDEX "student_school_admission_number_key" ON "student_school"("admission_number");

-- CreateIndex
CREATE UNIQUE INDEX "subject_code_key" ON "subject"("code");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "academic_year" ADD CONSTRAINT "academic_year_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_made_by_fkey" FOREIGN KEY ("made_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "announcement" ADD CONSTRAINT "announcement_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "award" ADD CONSTRAINT "award_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("academic_year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "class" ADD CONSTRAINT "class_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "fk_head_teacher" FOREIGN KEY ("head_of_department") REFERENCES "staff"("staff_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_class_participant" ADD CONSTRAINT "event_class_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_school_participant" ADD CONSTRAINT "event_school_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_school_participant" ADD CONSTRAINT "event_school_participant_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_stream_participant" ADD CONSTRAINT "event_stream_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_stream_participant" ADD CONSTRAINT "event_stream_participant_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("stream_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_user_participant" ADD CONSTRAINT "event_user_participant_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_user_participant" ADD CONSTRAINT "event_user_participant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam" ADD CONSTRAINT "exam_semester_id_fkey" FOREIGN KEY ("semester_id") REFERENCES "semester"("semester_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_exam_id_fkey" FOREIGN KEY ("exam_id") REFERENCES "exam"("exam_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("stream_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_supervisor_fkey" FOREIGN KEY ("supervisor") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("academic_year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee" ADD CONSTRAINT "fee_fee_type_id_fkey" FOREIGN KEY ("fee_type_id") REFERENCES "fee_type"("fee_type_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fee_type" ADD CONSTRAINT "fee_type_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_recepient_fkey" FOREIGN KEY ("recepient") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_sender_fkey" FOREIGN KEY ("sender") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "parent"("parent_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_student" ADD CONSTRAINT "parent_student_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_fee_id_fkey" FOREIGN KEY ("fee_id") REFERENCES "fee"("fee_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_exam_sitting_id_fkey" FOREIGN KEY ("exam_sitting_id") REFERENCES "exam_sitting"("exam_sitting_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_marked_by_fkey" FOREIGN KEY ("marked_by") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "result" ADD CONSTRAINT "result_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "event"("event_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_reviewer_id_fkey" FOREIGN KEY ("reviewer_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "review" ADD CONSTRAINT "review_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_facility_id_fkey" FOREIGN KEY ("facility_id") REFERENCES "facility"("facility_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "school_facility" ADD CONSTRAINT "school_facility_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "semester" ADD CONSTRAINT "semester_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("academic_year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "staff" ADD CONSTRAINT "staff_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_school" ADD CONSTRAINT "student_school_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("stream_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_school" ADD CONSTRAINT "student_school_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_academic_year_id_fkey" FOREIGN KEY ("academic_year_id") REFERENCES "academic_year"("academic_year_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "student"("student_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "student_subject" ADD CONSTRAINT "student_subject_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("department_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher" ADD CONSTRAINT "teacher_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("staff_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_subject" ADD CONSTRAINT "teacher_subject_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "teacher_subject" ADD CONSTRAINT "teacher_subject_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable_slot" ADD CONSTRAINT "timetable_slot_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable_slot" ADD CONSTRAINT "timetable_slot_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subject"("subject_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "timetable_slot" ADD CONSTRAINT "timetable_slot_teacher_id_fkey" FOREIGN KEY ("teacher_id") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
