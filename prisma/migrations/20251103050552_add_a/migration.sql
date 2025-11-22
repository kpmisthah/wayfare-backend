/*
  Warnings:

  - Added the required column `hell` to the `Conversation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conversation" ADD COLUMN     "hell" TEXT NOT NULL;
