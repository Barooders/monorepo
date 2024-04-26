-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "dbt";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- CreateEnum
CREATE TYPE "Condition" AS ENUM ('REFURBISHED_AS_NEW', 'AS_NEW', 'VERY_GOOD', 'GOOD');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ProductNotation" AS ENUM ('A', 'B', 'C');

-- CreateEnum
CREATE TYPE "BrandRating" AS ENUM ('TOP', 'MID', 'LOW');

-- CreateTable
CREATE TABLE "store_discount" (
    "id" BIGINT NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "starts_at" TIMESTAMPTZ(6) NOT NULL,
    "ends_at" TIMESTAMPTZ(6),
    "value" DOUBLE PRECISION NOT NULL,
    "code" TEXT,
    "value_type" VARCHAR(256) NOT NULL,
    "is_public" BOOLEAN NOT NULL,
    "min_amount" DOUBLE PRECISION
);

-- CreateTable
CREATE TABLE "store_discount_collection" (
    "collection_internal_id" TEXT NOT NULL,
    "discount_id" BIGINT NOT NULL,

    CONSTRAINT "store_discount_collection_pkey" PRIMARY KEY ("collection_internal_id","discount_id")
);

-- CreateTable
CREATE TABLE "store_collection" (
    "id" TEXT NOT NULL,
    "shopify_id" BIGINT NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "handle" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "store_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_product_collection" (
    "collection_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "syncDate" DATE NOT NULL,

    CONSTRAINT "store_product_collection_pkey" PRIMARY KEY ("collection_id","product_id")
);

-- CreateTable
CREATE TABLE "store_discount_product" (
    "discount_title" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "syncDate" DATE NOT NULL,

    CONSTRAINT "store_discount_product_pkey" PRIMARY KEY ("discount_title","product_id")
);

-- CreateTable
CREATE TABLE "store_product_collection_with_manual_collections" (
    "collection_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "syncDate" DATE NOT NULL,

    CONSTRAINT "store_product_collection_with_manual_collections_pkey" PRIMARY KEY ("collection_id","product_id")
);

-- CreateTable
CREATE TABLE "store_base_product" (
    "id" TEXT NOT NULL,
    "shopifyId" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "vendorId" UUID NOT NULL,

    CONSTRAINT "store_base_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_base_product_variant" (
    "id" TEXT NOT NULL,
    "shopify_id" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "store_base_product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_exposed_product" (
    "id" TEXT NOT NULL,
    "publishedAt" TIMESTAMPTZ(6),
    "productType" VARCHAR(256) NOT NULL,
    "status" "ProductStatus" NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "vendor" VARCHAR(256) NOT NULL,
    "description" VARCHAR(131072),
    "handle" VARCHAR(256) NOT NULL,
    "numberOfViews" BIGINT NOT NULL DEFAULT 0,
    "total_quantity" BIGINT NOT NULL DEFAULT 0,
    "brand" TEXT,
    "size" TEXT,
    "gender" TEXT,
    "model" TEXT,
    "modelYear" TEXT,
    "syncDate" DATE NOT NULL,
    "firstImage" VARCHAR(512),

    CONSTRAINT "store_exposed_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_b2b_product" (
    "id" TEXT NOT NULL,
    "largest_bundle_price_in_cents" BIGINT,

    CONSTRAINT "store_b2b_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_bundle_price" (
    "id" TEXT NOT NULL,
    "min_quantity" INTEGER NOT NULL,
    "unit_price_in_cents" BIGINT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "store_bundle_price_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_product_for_admin" (
    "id" TEXT NOT NULL,
    "source_url" TEXT,

    CONSTRAINT "store_product_for_admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_product_for_analytics" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL,
    "vendor_id" UUID NOT NULL,
    "shopify_id" BIGINT NOT NULL,
    "calculated_scoring" DOUBLE PRECISION NOT NULL,
    "source" TEXT,
    "manual_notation" "ProductNotation",
    "vendor_notation" "ProductNotation",
    "calculated_notation" "ProductNotation",
    "calculated_notation_beta" "ProductNotation",
    "notation" "ProductNotation",
    "views_last_30_days" BIGINT NOT NULL DEFAULT 0,
    "condition_from_variants" "Condition",
    "is_new" BOOLEAN,
    "ean_code" TEXT,
    "is_bike" BOOLEAN NOT NULL DEFAULT false,
    "image_count" INTEGER NOT NULL DEFAULT 0,
    "orders_count" INTEGER NOT NULL DEFAULT 0,
    "favorites_count" INTEGER NOT NULL DEFAULT 0,
    "highest_discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "brand" TEXT,
    "brand_rating" "BrandRating",
    "size" TEXT,
    "model_year" INTEGER NOT NULL DEFAULT 0,
    "model_year_with_override" INTEGER NOT NULL DEFAULT 0,
    "default_vendor_notation" "ProductNotation",
    "vendor_overrides_product_scoring" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "store_product_for_analytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_exposed_product_variant" (
    "id" TEXT NOT NULL,
    "inventory_quantity" BIGINT NOT NULL DEFAULT 0,
    "syncDate" DATE NOT NULL,
    "option1Name" VARCHAR(256),
    "option1" VARCHAR(256),
    "option2Name" VARCHAR(256),
    "option2" VARCHAR(256),
    "option3Name" VARCHAR(256),
    "option3" VARCHAR(256),
    "condition" "Condition",
    "isRefurbished" BOOLEAN,
    "requiresShipping" BOOLEAN,
    "title" VARCHAR(256) NOT NULL,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "store_exposed_product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_b2b_product_variant" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "compare_at_price" DOUBLE PRECISION,

    CONSTRAINT "store_b2b_product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_b2c_product_variant" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "compare_at_price" DOUBLE PRECISION,

    CONSTRAINT "store_b2c_product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_exposed_product_image" (
    "shopify_id" BIGINT NOT NULL,
    "productId" TEXT NOT NULL,
    "syncDate" DATE NOT NULL,
    "src" VARCHAR(512) NOT NULL,
    "width" BIGINT NOT NULL,
    "height" BIGINT NOT NULL,
    "alt" VARCHAR(256),
    "position" BIGINT NOT NULL,

    CONSTRAINT "store_exposed_product_image_pkey" PRIMARY KEY ("shopify_id")
);

-- CreateTable
CREATE TABLE "store_exposed_product_tag" (
    "product_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "full_tag" VARCHAR(256) NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "store_discount_id_key" ON "store_discount"("id");

-- CreateIndex
CREATE INDEX "store_product_collection_product_id_idx" ON "store_product_collection"("product_id");

-- CreateIndex
CREATE INDEX "store_product_collection_collection_id_idx" ON "store_product_collection"("collection_id");

-- CreateIndex
CREATE INDEX "store_discount_product_product_id_idx" ON "store_discount_product"("product_id");

-- CreateIndex
CREATE INDEX "store_discount_product_discount_title_idx" ON "store_discount_product"("discount_title");

-- CreateIndex
CREATE INDEX "store_product_collection_with_manual_collections_product_id_idx" ON "store_product_collection_with_manual_collections"("product_id");

-- CreateIndex
CREATE INDEX "store_product_collection_with_manual_collections_collection_idx" ON "store_product_collection_with_manual_collections"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_base_product_shopifyId_key" ON "store_base_product"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "store_base_product_variant_shopify_id_key" ON "store_base_product_variant"("shopify_id");

-- CreateIndex
CREATE INDEX "store_base_product_variant_productId_idx" ON "store_base_product_variant"("productId");

-- CreateIndex
CREATE INDEX "store_base_product_variant_id_idx" ON "store_base_product_variant"("id");

-- CreateIndex
CREATE INDEX "store_exposed_product_handle_idx" ON "store_exposed_product"("handle");

-- CreateIndex
CREATE INDEX "store_exposed_product_id_idx" ON "store_exposed_product"("id");

-- CreateIndex
CREATE INDEX "store_exposed_product_brand_idx" ON "store_exposed_product"("brand");

-- CreateIndex
CREATE INDEX "store_exposed_product_title_idx" ON "store_exposed_product"("title");

-- CreateIndex
CREATE INDEX "store_exposed_product_model_idx" ON "store_exposed_product"("model");

-- CreateIndex
CREATE INDEX "store_exposed_product_productType_idx" ON "store_exposed_product"("productType");

-- CreateIndex
CREATE INDEX "store_exposed_product_gender_idx" ON "store_exposed_product"("gender");

-- CreateIndex
CREATE INDEX "store_exposed_product_vendor_idx" ON "store_exposed_product"("vendor");

-- CreateIndex
CREATE INDEX "store_b2b_product_id_idx" ON "store_b2b_product"("id");

-- CreateIndex
CREATE INDEX "store_bundle_price_id_idx" ON "store_bundle_price"("id");

-- CreateIndex
CREATE INDEX "store_bundle_price_product_id_idx" ON "store_bundle_price"("product_id");

-- CreateIndex
CREATE INDEX "store_product_for_admin_id_idx" ON "store_product_for_admin"("id");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_for_analytics_id_key" ON "store_product_for_analytics"("id");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_for_analytics_shopify_id_key" ON "store_product_for_analytics"("shopify_id");

-- CreateIndex
CREATE INDEX "store_product_for_analytics_id_idx" ON "store_product_for_analytics"("id");

-- CreateIndex
CREATE INDEX "store_exposed_product_variant_id_idx" ON "store_exposed_product_variant"("id");

-- CreateIndex
CREATE INDEX "store_b2b_product_variant_id_idx" ON "store_b2b_product_variant"("id");

-- CreateIndex
CREATE INDEX "store_b2c_product_variant_id_idx" ON "store_b2c_product_variant"("id");

-- CreateIndex
CREATE INDEX "store_exposed_product_image_productId_idx" ON "store_exposed_product_image"("productId");

-- CreateIndex
CREATE INDEX "store_exposed_product_tag_product_id_idx" ON "store_exposed_product_tag"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_exposed_product_tag_product_id_full_tag_key" ON "store_exposed_product_tag"("product_id", "full_tag");
