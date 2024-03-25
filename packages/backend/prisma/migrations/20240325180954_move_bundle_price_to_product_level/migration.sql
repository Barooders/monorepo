/*
  Warnings:

  - You are about to drop the column `productVariantId` on the `BundlePrice` table. All the data in the column will be lost.
  - Added the required column `productId` to the `BundlePrice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."BundlePrice" DROP CONSTRAINT "BundlePrice_productVariantId_fkey";

-- AlterTable
ALTER TABLE "public"."BundlePrice" DROP COLUMN "productVariantId",
ADD COLUMN     "productId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BundlePrice" ADD CONSTRAINT "BundlePrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
