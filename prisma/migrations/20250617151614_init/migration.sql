/*
  Warnings:

  - You are about to drop the column `agencyId` on the `Transaction` table. All the data in the column will be lost.
  - Changed the type of `status` on the `Agency` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "AgencyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "status",
ADD COLUMN     "status" "AgencyStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "agencyId";

-- DropEnum
DROP TYPE "agencyStatus";
