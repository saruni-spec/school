-- AlterTable
ALTER TABLE "time_table" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "start_time" DROP NOT NULL,
ALTER COLUMN "start_time" SET DATA TYPE VARCHAR(30),
ALTER COLUMN "end_time" DROP NOT NULL,
ALTER COLUMN "end_time" SET DATA TYPE VARCHAR(30);
