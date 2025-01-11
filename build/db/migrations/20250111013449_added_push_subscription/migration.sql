-- AlterTable
ALTER TABLE "UserStatus" ADD COLUMN     "pushSubscription" TEXT,
ADD COLUMN     "pushSubscriptionUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
