/*
  Warnings:

  - The values [BOUGHT_WITHOUT] on the enum `PriceOfferStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PriceOfferStatus_new" AS ENUM ('PROPOSED', 'DECLINED', 'ACCEPTED', 'BOUGHT_WITH', 'CANCELED');
ALTER TABLE "public"."PriceOffer" ALTER COLUMN "status" TYPE "public"."PriceOfferStatus_new" USING ("status"::text::"public"."PriceOfferStatus_new");
ALTER TYPE "public"."PriceOfferStatus" RENAME TO "PriceOfferStatus_old";
ALTER TYPE "public"."PriceOfferStatus_new" RENAME TO "PriceOfferStatus";
DROP TYPE "public"."PriceOfferStatus_old";
COMMIT;
