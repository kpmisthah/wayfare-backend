/*
  Warnings:

  - The `duration` column on the `Package` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `price` on the `Package` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Package" DROP COLUMN "duration",
ADD COLUMN     "duration" INTEGER,
DROP COLUMN "price",
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
