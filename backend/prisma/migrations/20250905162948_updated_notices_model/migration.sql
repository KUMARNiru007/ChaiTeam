-- CreateEnum
CREATE TYPE "public"."noticeType" AS ENUM ('NORMAL', 'PINNED');

-- AlterTable
ALTER TABLE "public"."Notices" ADD COLUMN     "type" "public"."noticeType" NOT NULL DEFAULT 'NORMAL';
