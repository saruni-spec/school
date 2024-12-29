-- AlterTable
ALTER TABLE "school_leader" ALTER COLUMN "reason_removed" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "staff" ALTER COLUMN "school_code" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "admission_number" SET DATA TYPE TEXT,
ALTER COLUMN "student_code" SET DATA TYPE TEXT;
