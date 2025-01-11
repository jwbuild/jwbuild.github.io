/*
  Warnings:

  - You are about to drop the column `preciseLocation` on the `UserStatus` table. All the data in the column will be lost.
  - You are about to drop the column `preciseLocationUpdatedAt` on the `UserStatus` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserStatus" DROP COLUMN "preciseLocation",
DROP COLUMN "preciseLocationUpdatedAt";
