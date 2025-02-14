-- AlterTable
ALTER TABLE "exam_sitting" ADD COLUMN     "slot_id" INTEGER;

-- AddForeignKey
ALTER TABLE "exam_sitting" ADD CONSTRAINT "exam_sitting_slot_id_fkey" FOREIGN KEY ("slot_id") REFERENCES "slot"("id") ON DELETE SET NULL ON UPDATE CASCADE;
