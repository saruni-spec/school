/*
  Warnings:

  - You are about to drop the column `specific_context` on the `permission` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[role_id,resource,department_id,school_id,class_id,deleted_at]` on the table `permission` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "department" DROP CONSTRAINT "fk_head_teacher";

-- DropIndex
DROP INDEX "permission_resource_department_id_idx";

-- DropIndex
DROP INDEX "permission_role_id_resource_department_id_deleted_at_key";

-- AlterTable
ALTER TABLE "permission" DROP COLUMN "specific_context",
ADD COLUMN     "class_id" INTEGER,
ADD COLUMN     "school_facility_id" INTEGER,
ADD COLUMN     "school_id" INTEGER,
ADD COLUMN     "stream_id" INTEGER;

-- CreateIndex
CREATE INDEX "permission_resource_department_id_school_id_class_id_idx" ON "permission"("resource", "department_id", "school_id", "class_id");

-- CreateIndex
CREATE UNIQUE INDEX "permission_role_id_resource_department_id_school_id_class_i_key" ON "permission"("role_id", "resource", "department_id", "school_id", "class_id", "deleted_at");

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("department_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_school_id_fkey" FOREIGN KEY ("school_id") REFERENCES "school"("school_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "class"("class_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_school_facility_id_fkey" FOREIGN KEY ("school_facility_id") REFERENCES "school_facility"("school_facility_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permission" ADD CONSTRAINT "permission_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("stream_id") ON DELETE SET NULL ON UPDATE CASCADE;
