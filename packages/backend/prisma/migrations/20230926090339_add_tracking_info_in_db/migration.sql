/*
  Warnings:

  - Added the required column `trackingId` to the `Fulfillment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trackingUrl` to the `Fulfillment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Fulfillment" ADD COLUMN     "trackingId" TEXT NOT NULL,
ADD COLUMN     "trackingUrl" TEXT NOT NULL;
