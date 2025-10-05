-- AlterTable
ALTER TABLE "public"."Batch" ADD COLUMN     "bannerImageUrl" TEXT,
ADD COLUMN     "logoImageUrl" TEXT;

-- AlterTable
ALTER TABLE "public"."Groups" ADD COLUMN     "groupImageUrl" TEXT,
ADD COLUMN     "logoImageUrl" TEXT;
