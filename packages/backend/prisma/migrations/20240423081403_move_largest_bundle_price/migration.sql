/*
  Warnings:

  - You are about to drop the column `largest_bundle_price_in_cents` on the `store_base_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_base_product" DROP COLUMN "largest_bundle_price_in_cents";

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" ADD COLUMN     "published_at" TIMESTAMPTZ(6);
