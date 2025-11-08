/*
  Warnings:

  - Added the required column `agencyEarning` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `commissionRate` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformEarning` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "agencyEarning" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "commissionRate" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "platformEarning" DOUBLE PRECISION NOT NULL;
