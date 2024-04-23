/*
  Warnings:

  - You are about to drop the column `brand` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `first_image` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `handle` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `model` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `model_year` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_views` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `product_type` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `publishedAt` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `size` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `sync_date` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `total_quantity` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `compare_at_price` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `inventory_quantity` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `is_refurbished` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option_1` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option_1_name` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option_2` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option_2_name` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option_3` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option_3_name` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `published_at` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `requires_shipping` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `sync_date` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `store_base_product_variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_base_product" DROP COLUMN "brand",
DROP COLUMN "description",
DROP COLUMN "first_image",
DROP COLUMN "gender",
DROP COLUMN "handle",
DROP COLUMN "model",
DROP COLUMN "model_year",
DROP COLUMN "number_of_views",
DROP COLUMN "product_type",
DROP COLUMN "publishedAt",
DROP COLUMN "size",
DROP COLUMN "status",
DROP COLUMN "sync_date",
DROP COLUMN "title",
DROP COLUMN "total_quantity";

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" DROP COLUMN "compare_at_price",
DROP COLUMN "condition",
DROP COLUMN "inventory_quantity",
DROP COLUMN "is_refurbished",
DROP COLUMN "option_1",
DROP COLUMN "option_1_name",
DROP COLUMN "option_2",
DROP COLUMN "option_2_name",
DROP COLUMN "option_3",
DROP COLUMN "option_3_name",
DROP COLUMN "price",
DROP COLUMN "published_at",
DROP COLUMN "requires_shipping",
DROP COLUMN "sync_date",
DROP COLUMN "title",
DROP COLUMN "updated_at";

-- CreateTable
CREATE TABLE "dbt"."store_b2c_product_variant" (
    "shopify_id" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "store_b2c_product_variant_pkey" PRIMARY KEY ("shopify_id")
);

-- CreateIndex
CREATE INDEX "store_b2c_product_variant_shopify_id_idx" ON "dbt"."store_b2c_product_variant"("shopify_id");
