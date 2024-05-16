/*
  Warnings:

  - Made the column `priceInCents` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."ProductVariant" ALTER COLUMN "priceInCents" SET NOT NULL;
