/*
  Warnings:

  - The values [library,lab,sports_field,canteen,swimming_pool,transport] on the enum `facility_type` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `notes` on the `school_facility` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "facility_type_new" AS ENUM ('Educational', 'Recreational', 'Dining', 'Sports', 'Transportation');
ALTER TABLE "facility" ALTER COLUMN "type" TYPE "facility_type_new" USING ("type"::text::"facility_type_new");
ALTER TYPE "facility_type" RENAME TO "facility_type_old";
ALTER TYPE "facility_type_new" RENAME TO "facility_type";
DROP TYPE "facility_type_old";
COMMIT;

-- AlterTable
ALTER TABLE "school_facility" DROP COLUMN "notes",
ADD COLUMN     "description" VARCHAR(100);
