/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `store_discount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `store_product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[shopifyId]` on the table `store_product_image` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[product_id,full_tag]` on the table `store_product_tags` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `store_product_variant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id` on table `store_discount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `store_discount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `starts_at` on table `store_discount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `store_discount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value_type` on table `store_discount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `is_public` on table `store_discount` required. This step will fail if there are existing NULL values in that column.
  - Made the column `collection_id` on table `store_discount_collection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `discount_id` on table `store_discount_collection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shopifyId` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shopifyIdString` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productType` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `status` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `title` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendor` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `handle` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `vendorId` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sync_date` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `row_number` on table `store_product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shopifyId` on table `store_product_image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_shopify_id` on table `store_product_image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sync_date` on table `store_product_image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `src` on table `store_product_image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `width` on table `store_product_image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `height` on table `store_product_image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `position` on table `store_product_image` required. This step will fail if there are existing NULL values in that column.
  - Made the column `product_id` on table `store_product_tags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `tag` on table `store_product_tags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `full_tag` on table `store_product_tags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `value` on table `store_product_tags` required. This step will fail if there are existing NULL values in that column.
  - Made the column `id` on table `store_product_variant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `shopifyId` on table `store_product_variant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sync_date` on table `store_product_variant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_discount" ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "starts_at" SET NOT NULL,
ALTER COLUMN "value" SET NOT NULL,
ALTER COLUMN "value_type" SET NOT NULL,
ALTER COLUMN "is_public" SET NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_discount_collection" ALTER COLUMN "collection_id" SET NOT NULL,
ALTER COLUMN "discount_id" SET NOT NULL,
ADD CONSTRAINT "store_discount_collection_pkey" PRIMARY KEY ("collection_id", "discount_id");

-- AlterTable
ALTER TABLE "dbt"."store_product" ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "shopifyId" SET NOT NULL,
ALTER COLUMN "shopifyIdString" SET NOT NULL,
ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "productType" SET NOT NULL,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "title" SET NOT NULL,
ALTER COLUMN "vendor" SET NOT NULL,
ALTER COLUMN "handle" SET NOT NULL,
ALTER COLUMN "vendorId" SET NOT NULL,
ALTER COLUMN "sync_date" SET NOT NULL,
ALTER COLUMN "row_number" SET NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_product_image" ALTER COLUMN "shopifyId" SET NOT NULL,
ALTER COLUMN "product_shopify_id" SET NOT NULL,
ALTER COLUMN "sync_date" SET NOT NULL,
ALTER COLUMN "src" SET NOT NULL,
ALTER COLUMN "width" SET NOT NULL,
ALTER COLUMN "height" SET NOT NULL,
ALTER COLUMN "position" SET NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_product_tags" ALTER COLUMN "product_id" SET NOT NULL,
ALTER COLUMN "tag" SET NOT NULL,
ALTER COLUMN "full_tag" SET NOT NULL,
ALTER COLUMN "value" SET NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_product_variant" ALTER COLUMN "id" SET NOT NULL,
ALTER COLUMN "shopifyId" SET NOT NULL,
ALTER COLUMN "sync_date" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "store_discount_id_key" ON "dbt"."store_discount"("id");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_id_key" ON "dbt"."store_product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_image_shopifyId_key" ON "dbt"."store_product_image"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_tags_product_id_full_tag_key" ON "dbt"."store_product_tags"("product_id", "full_tag");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_variant_id_key" ON "dbt"."store_product_variant"("id");
