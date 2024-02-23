-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dbt";

-- CreateTable
CREATE TABLE "dbt"."store_discount" (
    "id" BIGINT,
    "title" VARCHAR(256),
    "starts_at" TIMESTAMPTZ(6),
    "ends_at" TIMESTAMPTZ(6),
    "value" DOUBLE PRECISION,
    "code" TEXT,
    "value_type" VARCHAR(256),
    "is_public" BOOLEAN
);

-- CreateTable
CREATE TABLE "dbt"."store_discount_collection" (
    "collection_id" BIGINT,
    "discount_id" BIGINT
);

-- CreateTable
CREATE TABLE "dbt"."store_product" (
    "id" TEXT,
    "shopifyId" BIGINT,
    "shopifyIdString" TEXT,
    "createdAt" TIMESTAMPTZ(6),
    "publishedAt" TIMESTAMPTZ(6),
    "productType" VARCHAR(256),
    "status" VARCHAR(256),
    "title" VARCHAR(256),
    "vendor" VARCHAR(256),
    "description" VARCHAR(131072),
    "handle" VARCHAR(256),
    "vendorId" UUID,
    "brand" TEXT,
    "size" TEXT,
    "gender" TEXT,
    "condition" TEXT,
    "model" TEXT,
    "modelYear" TEXT,
    "sync_date" DATE,
    "firstImage" VARCHAR(512),
    "cheapestVariantPrice" DOUBLE PRECISION,
    "row_number" BIGINT
);

-- CreateTable
CREATE TABLE "dbt"."store_product_image" (
    "shopifyId" BIGINT,
    "product_shopify_id" BIGINT,
    "sync_date" DATE,
    "src" VARCHAR(512),
    "width" BIGINT,
    "height" BIGINT,
    "alt" VARCHAR(256),
    "position" BIGINT
);

-- CreateTable
CREATE TABLE "dbt"."store_product_tags" (
    "product_id" BIGINT,
    "tag" TEXT,
    "full_tag" VARCHAR(256),
    "value" TEXT
);

-- CreateTable
CREATE TABLE "dbt"."store_product_variant" (
    "id" TEXT,
    "shopifyId" BIGINT,
    "inventoryQuantity" BIGINT,
    "sync_date" DATE,
    "product_shopify_id" BIGINT,
    "price" DOUBLE PRECISION,
    "compareAtPrice" DOUBLE PRECISION,
    "option1Name" VARCHAR(256),
    "option1" VARCHAR(256),
    "option2Name" VARCHAR(256),
    "option2" VARCHAR(256),
    "option3Name" VARCHAR(256),
    "option3" VARCHAR(256),
    "requiresShipping" BOOLEAN,
    "title" VARCHAR(256),
    "createdAt" TIMESTAMPTZ(6),
    "updatedAt" TIMESTAMPTZ(6)
);

-- CreateIndex
CREATE INDEX "store_discount_id_idx" ON "dbt"."store_discount"("id");

-- CreateIndex
CREATE INDEX "store_product_handle_idx" ON "dbt"."store_product"("handle");

-- CreateIndex
CREATE INDEX "store_product_id_idx" ON "dbt"."store_product"("id");

-- CreateIndex
CREATE INDEX "store_product_image_product_shopify_id_idx" ON "dbt"."store_product_image"("product_shopify_id");

-- CreateIndex
CREATE INDEX "store_product_tags_product_id_idx" ON "dbt"."store_product_tags"("product_id");

-- CreateIndex
CREATE INDEX "store_product_variant_product_shopify_id_idx" ON "dbt"."store_product_variant"("product_shopify_id");
