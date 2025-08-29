-- CreateEnum
CREATE TYPE "public"."applicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'WITHDRAWN');

-- CreateTable
CREATE TABLE "public"."JoinApplication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "status" "public"."applicationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JoinApplication_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."JoinApplication" ADD CONSTRAINT "JoinApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."JoinApplication" ADD CONSTRAINT "JoinApplication_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "public"."Groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;
