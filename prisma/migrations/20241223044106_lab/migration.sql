-- AlterEnum
ALTER TYPE "facility_type" ADD VALUE 'RESEARCH';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "role_type" ADD VALUE 'LAB_TECHNICIAN';
ALTER TYPE "role_type" ADD VALUE 'INVENTORY_MANAGER';
