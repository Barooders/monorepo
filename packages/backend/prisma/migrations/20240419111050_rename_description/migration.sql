/*
  Warnings:

  - You are about to drop the column `description` on the `PriceOffer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."PriceOffer" RENAME COLUMN "description" TO "internalNote";