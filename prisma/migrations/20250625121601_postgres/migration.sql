/*
  Warnings:

  - Added the required column `agencyId` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `preferences` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "agencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT NOT NULL DEFAULT 'null',
ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "preferences" SET NOT NULL,
ALTER COLUMN "preferences" SET DEFAULT '{}';
