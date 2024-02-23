/*
  Warnings:

  - You are about to drop the column `productShopifyId` on the `PriceOffer` table. All the data in the column will be lost.
  - Added the required column `variantId` to the `PriceOffer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PriceOffer" DROP COLUMN "productShopifyId",
ADD COLUMN     "variantId" TEXT NOT NULL;
