/*
  Warnings:

  - Added the required column `inventory_quantity` to the `store_exposed_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2c_product_variant" ADD COLUMN     "compare_at_price" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" ADD COLUMN     "inventory_quantity" BIGINT NOT NULL DEFAULT 0;
