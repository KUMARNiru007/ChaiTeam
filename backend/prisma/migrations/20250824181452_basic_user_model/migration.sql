-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "accessToken" TEXT,
ADD COLUMN     "image" TEXT,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "refreshToken" TEXT;
