/*
  Warnings:

  - Added the required column `total_quantity` to the `store_exposed_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" ADD COLUMN     "total_quantity" BIGINT NOT NULL;

-- CreateTable
CREATE TABLE "dbt"."store_b2c_product_variant" (
    "shopify_id" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "store_b2c_product_variant_pkey" PRIMARY KEY ("shopify_id")
);

-- CreateIndex
CREATE INDEX "store_b2c_product_variant_shopify_id_idx" ON "dbt"."store_b2c_product_variant"("shopify_id");
