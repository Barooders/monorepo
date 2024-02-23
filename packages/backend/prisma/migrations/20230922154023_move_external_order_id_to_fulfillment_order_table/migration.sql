/*
  Warnings:

  - You are about to drop the column `externalOrderId` on the `OrderLines` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."FulfillmentOrder" ADD COLUMN     "externalOrderId" TEXT;

-- AlterTable
ALTER TABLE "public"."OrderLines" DROP COLUMN "externalOrderId";
