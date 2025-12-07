-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('CONNECTION_REQUEST', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "Notification" ADD COLUMN     "types" "NotificationStatus" NOT NULL DEFAULT 'CONNECTION_REQUEST';
