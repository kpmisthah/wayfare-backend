/*
  Warnings:

  - Made the column `email` on table `UserVerification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserVerification" ALTER COLUMN "email" SET NOT NULL;
