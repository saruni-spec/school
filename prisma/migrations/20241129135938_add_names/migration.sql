/*
  Warnings:

  - You are about to drop the column `facility_name` on the `facility` table. All the data in the column will be lost.
  - You are about to drop the column `stream_name` on the `stream` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name,type]` on the table `facility` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[class_id,name]` on the table `stream` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `stream` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "facility_facility_name_type_key";

-- DropIndex
DROP INDEX "stream_class_id_stream_name_key";

-- AlterTable
ALTER TABLE "facility" DROP COLUMN "facility_name",
ADD COLUMN     "name" VARCHAR(50);

-- AlterTable
ALTER TABLE "fee" ADD COLUMN     "name" VARCHAR(50);

-- AlterTable
ALTER TABLE "slot" ADD COLUMN     "name" VARCHAR(50);

-- AlterTable
ALTER TABLE "stream" DROP COLUMN "stream_name",
ADD COLUMN     "name" VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "name" VARCHAR(50);

-- CreateIndex
CREATE UNIQUE INDEX "facility_name_type_key" ON "facility"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "stream_class_id_name_key" ON "stream"("class_id", "name");
