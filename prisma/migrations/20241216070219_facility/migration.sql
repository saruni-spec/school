/*
  Warnings:

  - A unique constraint covering the columns `[name,type]` on the table `facility` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `facility` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `facility` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "facility_name_key";

-- AlterTable
ALTER TABLE "facility" ADD COLUMN     "type" "facility_type" NOT NULL,
DROP COLUMN "name",
ADD COLUMN     "name" VARCHAR(20) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "facility_name_type_key" ON "facility"("name", "type");
