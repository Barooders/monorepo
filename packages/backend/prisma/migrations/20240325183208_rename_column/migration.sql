/*
  Warnings:

  - You are about to drop the column `inventory_quantity` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `largest_bundle_price_in_cents` on the `store_b2b_product_variant` table. All the data in the column will be lost.
  - Added the required column `total_quantity` to the `store_b2b_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product" DROP COLUMN "inventory_quantity",
ADD COLUMN     "largest_bundle_price_in_cents" BIGINT,
ADD COLUMN     "total_quantity" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_b2b_product_variant" DROP COLUMN "largest_bundle_price_in_cents";
