/*
  Warnings:

  - The `specialization` column on the `Agency` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "specialization",
ADD COLUMN     "specialization" TEXT[] DEFAULT ARRAY[]::TEXT[];
