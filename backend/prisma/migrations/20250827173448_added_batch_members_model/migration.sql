/*
  Warnings:

  - You are about to drop the column `capacity` on the `Batch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Batch" DROP COLUMN "capacity",
ADD COLUMN     "description" TEXT;

-- CreateTable
CREATE TABLE "public"."BatchMember" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,

    CONSTRAINT "BatchMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BatchMember_userId_batchId_key" ON "public"."BatchMember"("userId", "batchId");

-- AddForeignKey
ALTER TABLE "public"."BatchMember" ADD CONSTRAINT "BatchMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BatchMember" ADD CONSTRAINT "BatchMember_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."Batch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
