/*
  Warnings:

  - You are about to drop the column `userId` on the `BatchMember` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."BatchMember" DROP CONSTRAINT "BatchMember_userId_fkey";

-- DropIndex
DROP INDEX "public"."BatchMember_userId_batchId_key";

-- AlterTable
ALTER TABLE "public"."BatchMember" DROP COLUMN "userId",
ADD COLUMN     "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
