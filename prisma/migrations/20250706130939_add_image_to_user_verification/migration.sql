-- AlterTable
ALTER TABLE "UserVerification" ADD COLUMN     "profileImage" TEXT,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "otp_expiry" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
