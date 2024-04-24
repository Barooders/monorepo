/*
  Warnings:

  - You are about to drop the column `brand` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `first_image` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `handle` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `product_type` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `published_at` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `sync_date` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `store_b2b_product` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `store_b2b_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `inventory_quantity` on the `store_b2b_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `sync_date` on the `store_b2b_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `store_b2b_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `store_b2b_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `compareAtPrice` on the `store_exposed_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryQuantity` on the `store_exposed_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `store_exposed_product_variant` table. All the data in the column will be lost.
  - Added the required column `inventory_quantity` to the `store_exposed_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product" DROP COLUMN "brand",
DROP COLUMN "first_image",
DROP COLUMN "handle",
DROP COLUMN "product_type",
DROP COLUMN "published_at",
DROP COLUMN "status",
DROP COLUMN "sync_date",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "dbt"."store_b2b_product_variant" DROP COLUMN "condition",
DROP COLUMN "inventory_quantity",
DROP COLUMN "sync_date",
DROP COLUMN "title",
DROP COLUMN "updated_at";

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" DROP COLUMN "compareAtPrice",
DROP COLUMN "inventoryQuantity",
DROP COLUMN "price";

ALTER TABLE "dbt"."store_b2b_product" DROP COLUMN "total_quantity";