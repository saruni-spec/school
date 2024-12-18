/*
  Warnings:

  - A unique constraint covering the columns `[stream_id,is_current]` on the table `class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "class_stream_id_is_current_key" ON "class"("stream_id", "is_current");
