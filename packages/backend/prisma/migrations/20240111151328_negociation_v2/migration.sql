/*
  Warnings:

  - The values [REFUSED_BY_BAROODERS,REFUSED_BY_VENDOR] on the enum `PriceOfferStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customerId` on the `PriceOffer` table. All the data in the column will be lost.
  - You are about to drop the column `newPrice` on the `PriceOffer` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `PriceOffer` table. All the data in the column will be lost.
  - You are about to drop the column `variantId` on the `PriceOffer` table. All the data in the column will be lost.
  - Added the required column `buyerId` to the `PriceOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initiatedBy` to the `PriceOffer` table without a default value. This is not possible if the table is not empty.
  - Added the required column `newPriceInCents` to the `PriceOffer` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PriceOfferStatus_new" AS ENUM ('PROPOSED', 'DECLINED', 'ACCEPTED', 'BOUGHT_WITH', 'BOUGHT_WITHOUT');
ALTER TABLE "public"."PriceOffer" ALTER COLUMN "status" TYPE "public"."PriceOfferStatus_new" USING ("status"::text::"public"."PriceOfferStatus_new");
ALTER TYPE "public"."PriceOfferStatus" RENAME TO "PriceOfferStatus_old";
ALTER TYPE "public"."PriceOfferStatus_new" RENAME TO "PriceOfferStatus";
DROP TYPE "public"."PriceOfferStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."PriceOffer" DROP CONSTRAINT "PriceOffer_customerId_fkey";

-- AlterTable
ALTER TABLE "public"."PriceOffer" DROP COLUMN "customerId",
DROP COLUMN "newPrice",
DROP COLUMN "productId",
DROP COLUMN "variantId",
ADD COLUMN     "buyerId" UUID NOT NULL,
ADD COLUMN     "discountCode" TEXT,
ADD COLUMN     "initiatedBy" UUID NOT NULL,
ADD COLUMN     "newPriceInCents" BIGINT NOT NULL,
ADD COLUMN     "productVariantId" TEXT;

-- CreateTable
CREATE TABLE "public"."NegociationAgreement" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "priority" INTEGER NOT NULL,
    "maxAmountPercent" INTEGER NOT NULL,
    "vendorId" UUID NOT NULL,
    "productType" TEXT,

    CONSTRAINT "NegociationAgreement_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_buyerId_fkey" FOREIGN KEY ("buyerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_initiatedBy_fkey" FOREIGN KEY ("initiatedBy") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NegociationAgreement" ADD CONSTRAINT "NegociationAgreement_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
