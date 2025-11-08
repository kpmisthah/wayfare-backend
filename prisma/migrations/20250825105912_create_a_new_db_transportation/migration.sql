/*
  Warnings:

  - A unique constraint covering the columns `[transportationId]` on the table `Package` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Package" ADD COLUMN     "transportationId" TEXT;

-- CreateTable
CREATE TABLE "Transportation" (
    "id" TEXT NOT NULL,
    "vehicle" TEXT NOT NULL,
    "pickup_point" TEXT NOT NULL,
    "drop_point" TEXT NOT NULL,
    "details" TEXT NOT NULL,

    CONSTRAINT "Transportation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Package_transportationId_key" ON "Package"("transportationId");

-- AddForeignKey
ALTER TABLE "Package" ADD CONSTRAINT "Package_transportationId_fkey" FOREIGN KEY ("transportationId") REFERENCES "Transportation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
