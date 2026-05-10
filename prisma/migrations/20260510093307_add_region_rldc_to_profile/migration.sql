-- AlterTable
ALTER TABLE "AccountManagerProfile" ADD COLUMN     "region" TEXT NOT NULL DEFAULT 'NR',
ADD COLUMN     "rldc" TEXT NOT NULL DEFAULT 'NRLDC';
