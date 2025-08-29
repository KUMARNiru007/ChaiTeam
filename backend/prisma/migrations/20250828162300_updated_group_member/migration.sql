/*
  Warnings:

  - You are about to drop the column `batch_id` on the `Groups` table. All the data in the column will be lost.
  - Added the required column `batchId` to the `Groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `batchName` to the `Groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `capacity` to the `Groups` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Groups" DROP CONSTRAINT "Groups_batch_id_fkey";

-- AlterTable
ALTER TABLE "public"."Groups" DROP COLUMN "batch_id",
ADD COLUMN     "batchId" TEXT NOT NULL,
ADD COLUMN     "batchName" TEXT NOT NULL,
ADD COLUMN     "capacity" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Groups" ADD CONSTRAINT "Groups_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "public"."Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
