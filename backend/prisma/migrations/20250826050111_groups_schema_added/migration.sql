-- AlterTable
ALTER TABLE "public"."Batch" ADD CONSTRAINT "Batch_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "public"."Batch_id_key";

-- CreateTable
CREATE TABLE "public"."Groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "tags" JSONB,
    "batch_id" TEXT NOT NULL,
    "leader_id" TEXT NOT NULL,
    "createdAT" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAT" TIMESTAMP(3) NOT NULL,
    "status" "public"."status" NOT NULL DEFAULT 'ACTIVE',
    "disbanded_at" TIMESTAMP(3),
    "disbanded_reason" TEXT,
    "visible_to_users" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Groups_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Groups" ADD CONSTRAINT "Groups_batch_id_fkey" FOREIGN KEY ("batch_id") REFERENCES "public"."Batch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Groups" ADD CONSTRAINT "Groups_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
