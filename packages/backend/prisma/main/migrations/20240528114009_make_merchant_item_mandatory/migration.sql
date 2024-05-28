/*
  Warnings:

  - Made the column `merchantItemId` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `merchantItemId` on table `ProductVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "merchantItemId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductVariant" ALTER COLUMN "merchantItemId" SET NOT NULL;
