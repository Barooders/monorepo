/*
  Warnings:

  - You are about to drop the column `internalProductId` on the `VendorProProduct` table. All the data in the column will be lost.
  - You are about to drop the column `internalVariantId` on the `VendorProVariant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."VendorProProduct_internalProductId_key";

-- DropIndex
DROP INDEX "public"."VendorProVariant_internalVariantId_key";

-- AlterTable
ALTER TABLE "public"."VendorProProduct" DROP COLUMN "internalProductId";

-- AlterTable
ALTER TABLE "public"."VendorProVariant" DROP COLUMN "internalVariantId";
