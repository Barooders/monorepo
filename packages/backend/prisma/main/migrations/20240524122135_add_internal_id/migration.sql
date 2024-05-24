/*
  Warnings:

  - A unique constraint covering the columns `[internalId]` on the table `VendorProProduct` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[internalId]` on the table `VendorProVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."VendorProProduct" ADD COLUMN     "internalId" TEXT;

-- AlterTable
ALTER TABLE "public"."VendorProVariant" ADD COLUMN     "internalId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "VendorProProduct_internalId_key" ON "public"."VendorProProduct"("internalId");

-- CreateIndex
CREATE UNIQUE INDEX "VendorProVariant_internalId_key" ON "public"."VendorProVariant"("internalId");
