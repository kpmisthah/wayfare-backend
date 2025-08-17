-- DropForeignKey
ALTER TABLE "Agency" DROP CONSTRAINT "Agency_transactionId_fkey";

-- AlterTable
ALTER TABLE "Agency" ALTER COLUMN "transactionId" DROP NOT NULL,
ALTER COLUMN "pendingPayouts" SET DEFAULT 0,
ALTER COLUMN "totalEarnings" SET DEFAULT 0,
ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AddForeignKey
ALTER TABLE "Agency" ADD CONSTRAINT "Agency_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
