/*
  Warnings:

  - Added the required column `email` to the `JoinApplication` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `JoinApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."JoinApplication" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
