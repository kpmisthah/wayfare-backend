/*
  Warnings:

  - The `picture` column on the `Package` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Package" DROP COLUMN "picture",
ADD COLUMN     "picture" TEXT[];
