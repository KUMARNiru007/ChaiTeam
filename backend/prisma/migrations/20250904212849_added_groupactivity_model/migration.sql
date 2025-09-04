-- CreateEnum
CREATE TYPE "public"."gropActivityType" AS ENUM ('GROUP_CREATED', 'GROUP_UPDATED', 'GROUP_DISBANDED', 'MEMBER_JOINED', 'MEMBER_LEFT', 'NOTICE_CREATED', 'NOTICE_UPDATED', 'NOTICE_DELETED');

-- AlterEnum
ALTER TYPE "public"."userActivityType" ADD VALUE 'DISBANNED_GROUP';

-- CreateTable
CREATE TABLE "public"."GroupActivity" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "action" "public"."gropActivityType" NOT NULL,
    "description" TEXT,
    "createAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GroupActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."GroupActivity" ADD CONSTRAINT "GroupActivity_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
