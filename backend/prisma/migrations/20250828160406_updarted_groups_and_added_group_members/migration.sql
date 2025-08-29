/*
  Warnings:

  - The `status` column on the `Groups` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[leader_id]` on the table `Groups` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."groupMemberRole" AS ENUM ('LEADER', 'MEMBER');

-- CreateEnum
CREATE TYPE "public"."groupStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PRIVATE', 'FULL', 'DISBANNED');

-- AlterEnum
ALTER TYPE "public"."userRole" ADD VALUE 'LEADER';

-- AlterTable
ALTER TABLE "public"."Groups" DROP COLUMN "status",
ADD COLUMN     "status" "public"."groupStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateTable
CREATE TABLE "public"."GroupMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "public"."groupMemberRole" NOT NULL,

    CONSTRAINT "GroupMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GroupMember_userId_key" ON "public"."GroupMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Groups_leader_id_key" ON "public"."Groups"("leader_id");

-- AddForeignKey
ALTER TABLE "public"."GroupMember" ADD CONSTRAINT "GroupMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GroupMember" ADD CONSTRAINT "GroupMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
