/*
  Warnings:

  - Made the column `merchant_item_id` on table `store_base_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `merchant_item_id` on table `store_base_product_variant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "store_base_product" ALTER COLUMN "merchant_item_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "store_base_product_variant" ALTER COLUMN "merchant_item_id" SET NOT NULL;
