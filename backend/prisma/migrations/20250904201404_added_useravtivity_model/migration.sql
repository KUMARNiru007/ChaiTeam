-- CreateEnum
CREATE TYPE "public"."userActivityType" AS ENUM ('ACCOUNT_CREATED', 'ACCOUNT_DELTED', 'APPLIED_TO_JOIN_GROUP', 'APLICATION_WITHDRAWN', 'JOINED_GROUP', 'LEAVED_GROUP', 'KICKED_FROM_GROUP', 'CREATED_GROUP');

-- CreateTable
CREATE TABLE "public"."UserActivity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "public"."userActivityType" NOT NULL,
    "description" TEXT,
    "creatdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."UserActivity" ADD CONSTRAINT "UserActivity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
