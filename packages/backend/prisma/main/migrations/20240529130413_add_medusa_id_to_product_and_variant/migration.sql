/*
  Warnings:

  - A unique constraint covering the columns `[medusaId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medusaId]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "medusaId" TEXT;

-- AlterTable
ALTER TABLE "public"."ProductVariant" ADD COLUMN     "medusaId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Product_medusaId_key" ON "public"."Product"("medusaId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_medusaId_key" ON "public"."ProductVariant"("medusaId");
