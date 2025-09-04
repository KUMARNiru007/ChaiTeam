-- CreateEnum
CREATE TYPE "public"."noticeScope" AS ENUM ('GROUP', 'BATCH', 'GLOBAL');

-- CreateTable
CREATE TABLE "public"."Noticebaord" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "scope" "public"."noticeScope" NOT NULL DEFAULT 'GROUP',
    "createdById" TEXT NOT NULL,
    "groupId" TEXT,
    "batchId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updateAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Noticebaord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Noticebaord" ADD CONSTRAINT "Noticebaord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Noticebaord" ADD CONSTRAINT "Noticebaord_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Noticebaord" ADD CONSTRAINT "Noticebaord_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
