-- CreateEnum
CREATE TYPE "dbt"."ProductNotation" AS ENUM ('A', 'B', 'C');

-- CreateTable
CREATE TABLE "dbt"."store_product_for_analytics" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "vendorId" UUID NOT NULL,
    "shopify_id" BIGINT NOT NULL,
    "source" TEXT,
    "manual_notation" "dbt"."ProductNotation",
    "calculated_notation" "dbt"."ProductNotation",
    "views_last_30_days" BIGINT NOT NULL DEFAULT 0,
    "condition_from_variants" "dbt"."Condition",
    "ean_code" TEXT,

    CONSTRAINT "store_product_for_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_product_for_analytics_shopify_id_key" ON "dbt"."store_product_for_analytics"("shopify_id");
