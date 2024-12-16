/*
  Warnings:

  - You are about to drop the column `type` on the `facility` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `facility` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "facility_type_key";

-- AlterTable
ALTER TABLE "facility" DROP COLUMN "type",
ADD COLUMN     "description" VARCHAR(100),
ADD COLUMN     "name" "facility_type";

-- CreateIndex
CREATE UNIQUE INDEX "facility_name_key" ON "facility"("name");
