/*
  Warnings:

  - You are about to alter the column `email` on the `BatchMember` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "public"."BatchMember" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);
