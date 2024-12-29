/*
  Warnings:

  - You are about to alter the column `id_code` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar(230)` to `VarChar(200)`.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "last_name" SET DATA TYPE VARCHAR(500),
ALTER COLUMN "id_code" SET DATA TYPE VARCHAR(200),
ALTER COLUMN "email" SET DATA TYPE VARCHAR(250),
ALTER COLUMN "phone" SET DATA TYPE VARCHAR(250);
