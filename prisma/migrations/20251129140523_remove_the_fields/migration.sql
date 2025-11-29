/*
  Warnings:

  - You are about to drop the column `approvedAt` on the `PayoutRequest` table. All the data in the column will be lost.
  - You are about to drop the column `completedAt` on the `PayoutRequest` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `PayoutRequest` table. All the data in the column will be lost.
  - You are about to drop the column `referenceId` on the `PayoutRequest` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PayoutRequest" DROP COLUMN "approvedAt",
DROP COLUMN "completedAt",
DROP COLUMN "notes",
DROP COLUMN "referenceId";
