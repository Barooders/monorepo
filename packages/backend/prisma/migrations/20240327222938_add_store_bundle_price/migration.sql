-- CreateTable
CREATE TABLE "dbt"."store_bundle_price" (
    "id" TEXT NOT NULL,
    "min_quantity" INTEGER NOT NULL,
    "unit_price_in_cents" BIGINT NOT NULL,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "store_bundle_price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_bundle_price_id_idx" ON "dbt"."store_bundle_price"("id");

-- CreateIndex
CREATE INDEX "store_bundle_price_product_id_idx" ON "dbt"."store_bundle_price"("product_id");
