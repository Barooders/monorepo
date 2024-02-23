/*
  Warnings:

  - You are about to drop the `DisputeImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."DisputeImage" DROP CONSTRAINT "DisputeImage_disputeId_fkey";

-- DropTable
DROP TABLE "public"."DisputeImage";

-- CreateTable
CREATE TABLE "public"."DisputeAttachment" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disputeId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,

    CONSTRAINT "DisputeAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."DisputeAttachment" ADD CONSTRAINT "DisputeAttachment_disputeId_fkey" FOREIGN KEY ("disputeId") REFERENCES "public"."Dispute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
