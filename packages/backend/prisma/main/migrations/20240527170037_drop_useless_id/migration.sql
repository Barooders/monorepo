/*
  Warnings:

  - The primary key for the `VendorProProduct` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VendorProProduct` table. All the data in the column will be lost.
  - The primary key for the `VendorProVariant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `VendorProVariant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."VendorProProduct_internalId_key";

-- DropIndex
DROP INDEX "public"."VendorProVariant_internalId_key";

-- AlterTable
ALTER TABLE "public"."VendorProProduct" DROP CONSTRAINT "VendorProProduct_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "VendorProProduct_pkey" PRIMARY KEY ("internalId");

-- AlterTable
ALTER TABLE "public"."VendorProVariant" DROP CONSTRAINT "VendorProVariant_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "VendorProVariant_pkey" PRIMARY KEY ("internalId");
