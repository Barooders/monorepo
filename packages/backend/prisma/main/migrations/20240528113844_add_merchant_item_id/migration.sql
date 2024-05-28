/*
  Warnings:

  - A unique constraint covering the columns `[merchantItemId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[merchantItemId]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.

*/

BEGIN;


-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "merchantItemId" TEXT;

-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "merchantItemId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_merchantItemId_key" ON "public"."Product"("merchantItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_merchantItemId_key" ON "public"."ProductVariant"("merchantItemId");

UPDATE "public"."Product" SET "merchantItemId" = "shopifyId"::TEXT;
UPDATE "public"."ProductVariant" SET "merchantItemId" = "shopifyId"::TEXT;

COMMIT;
