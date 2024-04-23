-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" ADD COLUMN     "total_quantity" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "dbt"."store_b2c_product_variant" (
    "shopify_id" BIGINT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "store_b2c_product_variant_pkey" PRIMARY KEY ("shopify_id")
);

-- CreateIndex
CREATE INDEX "store_b2c_product_variant_shopify_id_idx" ON "dbt"."store_b2c_product_variant"("shopify_id");
