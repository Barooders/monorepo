/*
  Warnings:

  - Added the required column `merchant_item_id` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchant_item_id` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_base_product" ADD COLUMN     "merchant_item_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "store_base_product_variant" ADD COLUMN     "merchant_item_id" TEXT NOT NULL;
