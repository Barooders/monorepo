-- CreateTable
CREATE TABLE "dbt"."store_base_product" (
    "id" TEXT NOT NULL,
    "shopifyId" BIGINT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL,
    "vendorId" UUID NOT NULL,

    CONSTRAINT "store_base_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbt"."store_base_product_variant" (
    "id" TEXT NOT NULL,
    "shopify_id" BIGINT NOT NULL,
    "created_at" TIMESTAMPTZ(6),
    "product_id" TEXT NOT NULL,

    CONSTRAINT "store_base_product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbt"."store_exposed_product" (
    "id" TEXT NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "product_type" VARCHAR(256) NOT NULL,
    "status" VARCHAR(256) NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "vendor" VARCHAR(256) NOT NULL,
    "description" VARCHAR(131072),
    "handle" VARCHAR(256) NOT NULL,
    "brand" TEXT,
    "size" TEXT,
    "gender" TEXT,
    "condition" TEXT,
    "model" TEXT,
    "model_year" TEXT,
    "sync_date" DATE NOT NULL,
    "first_image" VARCHAR(512),
    "cheapest_variant_price" DOUBLE PRECISION,

    CONSTRAINT "store_exposed_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbt"."store_exposed_product_variant" (
    "id" TEXT NOT NULL,
    "inventoryQuantity" BIGINT,
    "sync_date" DATE NOT NULL,
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
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "store_exposed_product_variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbt"."store_exposed_product_image" (
    "shopify_id" BIGINT NOT NULL,
    "product_id" TEXT NOT NULL,
    "sync_date" DATE NOT NULL,
    "src" VARCHAR(512) NOT NULL,
    "width" BIGINT NOT NULL,
    "height" BIGINT NOT NULL,
    "alt" VARCHAR(256),
    "position" BIGINT NOT NULL,

    CONSTRAINT "store_exposed_product_image_pkey" PRIMARY KEY ("shopify_id")
);

-- CreateTable
CREATE TABLE "dbt"."store_exposed_product_tag" (
    "product_id" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "full_tag" VARCHAR(256) NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "store_base_product_shopifyId_key" ON "dbt"."store_base_product"("shopifyId");

-- CreateIndex
CREATE INDEX "store_base_product_variant_product_id_idx" ON "dbt"."store_base_product_variant"("product_id");

-- CreateIndex
CREATE INDEX "store_exposed_product_handle_idx" ON "dbt"."store_exposed_product"("handle");

-- CreateIndex
CREATE INDEX "store_exposed_product_image_product_id_idx" ON "dbt"."store_exposed_product_image"("product_id");

-- CreateIndex
CREATE INDEX "store_exposed_product_tag_product_id_idx" ON "dbt"."store_exposed_product_tag"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_exposed_product_tag_product_id_full_tag_key" ON "dbt"."store_exposed_product_tag"("product_id", "full_tag");

-- AddForeignKey
ALTER TABLE "dbt"."store_base_product_variant" ADD CONSTRAINT "store_base_product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product" ADD CONSTRAINT "store_exposed_product_id_fkey" FOREIGN KEY ("id") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_variant" ADD CONSTRAINT "store_exposed_product_variant_id_fkey" FOREIGN KEY ("id") REFERENCES "dbt"."store_base_product_variant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_image" ADD CONSTRAINT "store_exposed_product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_tag" ADD CONSTRAINT "store_exposed_product_tag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
