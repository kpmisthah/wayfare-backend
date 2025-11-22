/*
  Warnings:

  - You are about to drop the column `bookingId` on the `WalletTransaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "WalletTransaction" DROP CONSTRAINT "WalletTransaction_bookingId_fkey";

-- AlterTable
ALTER TABLE "WalletTransaction" DROP COLUMN "bookingId";
