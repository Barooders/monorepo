/*
  Warnings:

  - Added the required column `productId` to the `PriceOffer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."PriceOffer" ADD COLUMN     "productId" TEXT NOT NULL;
