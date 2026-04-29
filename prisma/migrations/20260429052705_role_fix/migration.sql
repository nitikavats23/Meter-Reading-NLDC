/*
  Warnings:

  - Changed the type of `role` on the `RoleAssignment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'COORDINATOR');

-- AlterTable
ALTER TABLE "RoleAssignment" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;
