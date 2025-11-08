/*
  Warnings:

  - You are about to drop the column `payment` on the `Booking` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "payment",
ALTER COLUMN "status" SET DEFAULT 'PENDING';
