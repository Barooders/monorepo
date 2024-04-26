/*
  Warnings:

  - The primary key for the `store_b2b_product_variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopify_id` on the `store_b2b_product_variant` table. All the data in the column will be lost.
  - The primary key for the `store_b2c_product_variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopify_id` on the `store_b2c_product_variant` table. All the data in the column will be lost.
  - The primary key for the `store_exposed_product_variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopify_id` on the `store_exposed_product_variant` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "dbt"."store_b2b_product_variant_shopify_id_idx";

-- DropIndex
DROP INDEX "dbt"."store_b2c_product_variant_shopify_id_idx";

-- DropIndex
DROP INDEX "dbt"."store_exposed_product_variant_shopify_id_idx";

-- AlterTable
ALTER TABLE "dbt"."store_b2b_product_variant" DROP CONSTRAINT "store_b2b_product_variant_pkey",
DROP COLUMN "shopify_id",
ADD CONSTRAINT "store_b2b_product_variant_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbt"."store_b2c_product_variant" DROP CONSTRAINT "store_b2c_product_variant_pkey",
DROP COLUMN "shopify_id",
ADD CONSTRAINT "store_b2c_product_variant_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" DROP CONSTRAINT "store_exposed_product_variant_pkey",
DROP COLUMN "shopify_id",
ADD CONSTRAINT "store_exposed_product_variant_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "store_b2b_product_variant_id_idx" ON "dbt"."store_b2b_product_variant"("id");

-- CreateIndex
CREATE INDEX "store_b2c_product_variant_id_idx" ON "dbt"."store_b2c_product_variant"("id");

-- CreateIndex
CREATE INDEX "store_exposed_product_variant_id_idx" ON "dbt"."store_exposed_product_variant"("id");
