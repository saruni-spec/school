/*
  Warnings:

  - Made the column `school_id` on table `class` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `grade_level` on the `class` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "class" ALTER COLUMN "school_id" SET NOT NULL,
DROP COLUMN "grade_level",
ADD COLUMN     "grade_level" "school_type" NOT NULL;
