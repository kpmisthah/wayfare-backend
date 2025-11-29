/*
  Warnings:

  - You are about to drop the column `upiId` on the `AgencyBankDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AgencyBankDetails" DROP COLUMN "upiId",
ADD COLUMN     "branch" TEXT;
