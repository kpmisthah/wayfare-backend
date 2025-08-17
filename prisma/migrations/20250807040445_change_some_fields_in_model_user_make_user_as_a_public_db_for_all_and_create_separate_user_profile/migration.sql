/*
  Warnings:

  - You are about to drop the column `email` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `Agency` table. All the data in the column will be lost.
  - You are about to drop the column `chatIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `itenararyIds` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- DropForeignKey
ALTER TABLE "Feedbacks" DROP CONSTRAINT "Feedbacks_userId_fkey";

-- DropForeignKey
ALTER TABLE "Review" DROP CONSTRAINT "Review_userId_fkey";

-- DropForeignKey
ALTER TABLE "_UserPreferences" DROP CONSTRAINT "_UserPreferences_A_fkey";

-- DropIndex
DROP INDEX "Agency_email_key";

-- AlterTable
ALTER TABLE "Agency" DROP COLUMN "email",
DROP COLUMN "name",
DROP COLUMN "password",
DROP COLUMN "refreshToken";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "chatIds",
DROP COLUMN "itenararyIds",
DROP COLUMN "location",
DROP COLUMN "phone",
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "location" TEXT,
    "phone" TEXT,
    "itenararyIds" TEXT[],
    "chatIds" TEXT[],

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedbacks" ADD CONSTRAINT "Feedbacks_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserPreferences" ADD CONSTRAINT "_UserPreferences_A_fkey" FOREIGN KEY ("A") REFERENCES "UserProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
