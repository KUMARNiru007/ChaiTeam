/*
  Warnings:

  - You are about to drop the column `createAT` on the `GroupActivity` table. All the data in the column will be lost.
  - You are about to drop the column `creatdAT` on the `UserActivity` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."GroupActivity" DROP COLUMN "createAT",
ADD COLUMN     "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "public"."UserActivity" DROP COLUMN "creatdAT",
ADD COLUMN     "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
