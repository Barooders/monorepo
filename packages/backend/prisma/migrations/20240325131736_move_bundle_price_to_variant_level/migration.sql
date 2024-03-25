/*
  Warnings:

  - You are about to drop the column `productId` on the `BundlePrice` table. All the data in the column will be lost.
  - Added the required column `productVariantId` to the `BundlePrice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."BundlePrice" DROP CONSTRAINT "BundlePrice_productId_fkey";

-- AlterTable
ALTER TABLE "public"."BundlePrice" DROP COLUMN "productId",
ADD COLUMN     "productVariantId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BundlePrice" ADD CONSTRAINT "BundlePrice_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
