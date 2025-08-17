/*
  Warnings:

  - Made the column `otp_expiry` on table `UserVerification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserVerification" ALTER COLUMN "otp_expiry" SET NOT NULL;
