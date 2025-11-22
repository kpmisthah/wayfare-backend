/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[agencyId]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentIntentId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_transactionId_fkey";

-- DropIndex
DROP INDEX "Booking_transactionId_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "transactionId";

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "bookingId" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'inr',
ADD COLUMN     "paymentIntentId" TEXT NOT NULL,
ADD COLUMN     "paymentMethodId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "initiatedBy" SET DEFAULT 'USER',
ALTER COLUMN "paidAt" DROP NOT NULL,
ALTER COLUMN "paidAt" DROP DEFAULT,
ALTER COLUMN "agencyId" SET DATA TYPE TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_agencyId_key" ON "Transaction"("agencyId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_agencyId_fkey" FOREIGN KEY ("agencyId") REFERENCES "Agency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
