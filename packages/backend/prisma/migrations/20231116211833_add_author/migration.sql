/*
  Warnings:

  - Added the required column `authorId` to the `DisputeAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."DisputeAttachment" ADD COLUMN     "authorId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."DisputeAttachment" ADD CONSTRAINT "DisputeAttachment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
