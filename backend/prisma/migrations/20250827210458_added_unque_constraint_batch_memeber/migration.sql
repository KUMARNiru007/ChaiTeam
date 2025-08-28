/*
  Warnings:

  - A unique constraint covering the columns `[batchId,email]` on the table `BatchMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BatchMember_batchId_email_key" ON "public"."BatchMember"("batchId", "email");
