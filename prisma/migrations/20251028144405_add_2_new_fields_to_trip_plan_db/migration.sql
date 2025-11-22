/*
  Warnings:

  - Added the required column `startDate` to the `TripPlan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visibility` to the `TripPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripPlan" ADD COLUMN     "startDate" TEXT NOT NULL,
ADD COLUMN     "visibility" BOOLEAN NOT NULL;
