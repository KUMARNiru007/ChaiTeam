/*
  Warnings:

  - You are about to drop the `Noticebaord` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Noticebaord" DROP CONSTRAINT "Noticebaord_batchId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Noticebaord" DROP CONSTRAINT "Noticebaord_createdById_fkey";

-- DropForeignKey
ALTER TABLE "public"."Noticebaord" DROP CONSTRAINT "Noticebaord_groupId_fkey";

-- DropTable
DROP TABLE "public"."Noticebaord";

-- CreateTable
CREATE TABLE "public"."Notices" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "scope" "public"."noticeScope" NOT NULL DEFAULT 'GROUP',
    "createdById" TEXT NOT NULL,
    "groupId" TEXT,
    "batchId" TEXT,
    "isEdited" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notices_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Notices" ADD CONSTRAINT "Notices_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notices" ADD CONSTRAINT "Notices_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notices" ADD CONSTRAINT "Notices_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
