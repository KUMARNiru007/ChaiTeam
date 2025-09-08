/*
  Warnings:

  - You are about to drop the column `isInGroup` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,batchId]` on the table `GroupMember` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[leader_id,batchId]` on the table `Groups` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,groupId]` on the table `JoinApplication` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,groupId,status]` on the table `JoinApplication` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `batchId` to the `GroupMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."GroupMember_userId_key";

-- DropIndex
DROP INDEX "public"."Groups_leader_id_key";

-- DropIndex
DROP INDEX "public"."JoinApplication_userId_key";

-- AlterTable
ALTER TABLE "public"."GroupMember" ADD COLUMN     "batchId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "isInGroup";

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_userId_batchId_key" ON "public"."GroupMember"("userId", "batchId");

-- CreateIndex
CREATE UNIQUE INDEX "Groups_leader_id_batchId_key" ON "public"."Groups"("leader_id", "batchId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinApplication_userId_groupId_key" ON "public"."JoinApplication"("userId", "groupId");

-- CreateIndex
CREATE UNIQUE INDEX "JoinApplication_userId_groupId_status_key" ON "public"."JoinApplication"("userId", "groupId", "status");

-- AddForeignKey
ALTER TABLE "public"."GroupMember" ADD CONSTRAINT "GroupMember_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
