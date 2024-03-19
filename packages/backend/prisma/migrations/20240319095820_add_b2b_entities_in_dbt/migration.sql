-- CreateTable
CREATE TABLE "dbt"."store_b2b_product" (
    "id" TEXT NOT NULL,
    "published_at" TIMESTAMPTZ(6),
    "product_type" VARCHAR(256) NOT NULL,
    "status" "dbt"."ProductStatus" NOT NULL,
    "title" VARCHAR(256) NOT NULL,
    "handle" VARCHAR(256) NOT NULL,
    "syncDate" DATE NOT NULL,
    "firstImage" VARCHAR(512),

    CONSTRAINT "store_b2b_product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dbt"."store_b2b_product_variant" (
    "shopify_id" BIGINT NOT NULL,
    "inventory_quantity" BIGINT NOT NULL,
    "sync_date" DATE NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "condition" "dbt"."Condition",
    "updated_at" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "store_b2b_product_variant_pkey" PRIMARY KEY ("shopify_id")
);

-- CreateIndex
CREATE INDEX "store_b2b_product_id_idx" ON "dbt"."store_b2b_product"("id");

-- CreateIndex
CREATE INDEX "store_b2b_product_variant_shopify_id_idx" ON "dbt"."store_b2b_product_variant"("shopify_id");
