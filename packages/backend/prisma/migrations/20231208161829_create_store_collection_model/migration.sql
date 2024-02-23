/*
  Warnings:

  - You are about to drop the column `collection_id` on the `store_product_collection` table. All the data in the column will be lost.
  - Added the required column `collection_shopify_id` to the `store_product_collection` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "dbt"."store_product_collection_collection_id_productId_key";

-- AlterTable
ALTER TABLE "dbt"."store_product_collection" DROP COLUMN "collection_id",
ADD COLUMN     "collection_shopify_id" BIGINT NOT NULL,
ADD CONSTRAINT "store_product_collection_pkey" PRIMARY KEY ("collection_shopify_id", "productId");

-- CreateTable
CREATE TABLE "dbt"."store_collection" (
    "shopify_id" BIGINT NOT NULL,
    "title" VARCHAR(256) NOT NULL,

    CONSTRAINT "store_collection_pkey" PRIMARY KEY ("shopify_id")
);

-- CreateIndex
CREATE INDEX "store_product_collection_collection_shopify_id_idx" ON "dbt"."store_product_collection"("collection_shopify_id");
