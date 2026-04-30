-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Role" ADD VALUE 'RLDC_ADMIN';
ALTER TYPE "Role" ADD VALUE 'RLDC_COORDINATOR';
ALTER TYPE "Role" ADD VALUE 'RLDC_USER';
ALTER TYPE "Role" ADD VALUE 'RLDC_ANALYST';
ALTER TYPE "Role" ADD VALUE 'USER';

-- AlterTable
ALTER TABLE "Approval" ALTER COLUMN "approverId" DROP NOT NULL;
