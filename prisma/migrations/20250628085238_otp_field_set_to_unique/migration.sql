/*
  Warnings:

  - A unique constraint covering the columns `[otp]` on the table `UserVerification` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserVerification_otp_key" ON "UserVerification"("otp");
