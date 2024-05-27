/*
  Warnings:

  - Made the column `internalId` on table `VendorProProduct` required. This step will fail if there are existing NULL values in that column.
  - Made the column `internalId` on table `VendorProVariant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."VendorProProduct" ALTER COLUMN "internalId" SET NOT NULL;

-- AlterTable
ALTER TABLE "public"."VendorProVariant" ALTER COLUMN "internalId" SET NOT NULL;
