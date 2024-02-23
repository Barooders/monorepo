/*
  Warnings:

  - You are about to drop the column `refundedAt` on the `OrderLines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."OrderLines" DROP COLUMN "refundedAt",
ADD COLUMN     "canceledAt" TIMESTAMP(3);
