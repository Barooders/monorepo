/*
  Warnings:

  - Added the required column `name` to the `OrderLines` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('EUR');

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "shippingAddressAddress1" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingAddressAddress2" TEXT,
ADD COLUMN     "shippingAddressCity" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingAddressCountry" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingAddressFirstName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingAddressLastName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "shippingAddressZip" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "totalPriceCurrency" "public"."Currency" NOT NULL DEFAULT 'EUR',
ADD COLUMN     "totalPriceInCents" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."OrderLines" ADD COLUMN     "name" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "priceCurrency" "public"."Currency" NOT NULL DEFAULT 'EUR',
ADD COLUMN     "priceInCents" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "productBrand" TEXT,
ADD COLUMN     "productCondition" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "productGender" TEXT,
ADD COLUMN     "productHandle" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "productImage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "productModelYear" TEXT,
ADD COLUMN     "productSize" TEXT,
ADD COLUMN     "productType" TEXT NOT NULL DEFAULT '';
