/*
  Warnings:

  - You are about to drop the `_BookingToTransaction` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_BookingToTransaction" DROP CONSTRAINT "_BookingToTransaction_A_fkey";

-- DropForeignKey
ALTER TABLE "_BookingToTransaction" DROP CONSTRAINT "_BookingToTransaction_B_fkey";

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "transactionId" TEXT;

-- DropTable
DROP TABLE "_BookingToTransaction";

-- CreateIndex
CREATE UNIQUE INDEX "Booking_transactionId_key" ON "Booking"("transactionId");

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
