/*
  Warnings:

  - The primary key for the `store_discount_collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `collection_id` on the `store_discount_collection` table. All the data in the column will be lost.
  - You are about to drop the column `collection_shopify_id` on the `store_product_collection` table. All the data in the column will be lost.
  - You are about to drop the column `collection_shopify_id` on the `store_product_collection_with_manual_collections` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_discount_collection" DROP CONSTRAINT "store_discount_collection_pkey",
DROP COLUMN "collection_id",
ADD CONSTRAINT "store_discount_collection_pkey" PRIMARY KEY ("collection_internal_id", "discount_id");

-- AlterTable
ALTER TABLE "dbt"."store_product_collection" DROP COLUMN "collection_shopify_id";

-- AlterTable
ALTER TABLE "dbt"."store_product_collection_with_manual_collections" DROP COLUMN "collection_shopify_id";
