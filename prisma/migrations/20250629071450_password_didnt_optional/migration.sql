/*
  Warnings:

  - Made the column `password` on table `UserVerification` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserVerification" ALTER COLUMN "password" SET NOT NULL;
