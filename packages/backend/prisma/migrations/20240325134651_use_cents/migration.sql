/*
  Warnings:

  - You are about to drop the column `largest_bundle_price` on the `store_b2b_product_variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product_variant" DROP COLUMN "largest_bundle_price",
ADD COLUMN     "largest_bundle_price_in_cents" BIGINT;
