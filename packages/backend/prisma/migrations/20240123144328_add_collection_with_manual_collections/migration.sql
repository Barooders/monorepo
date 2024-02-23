-- CreateTable
CREATE TABLE "dbt"."store_product_collection_with_manual_collections" (
    "collection_shopify_id" BIGINT NOT NULL,
    "product_id" TEXT NOT NULL,
    "syncDate" DATE NOT NULL,

    CONSTRAINT "store_product_collection_with_manual_collections_pkey" PRIMARY KEY ("collection_shopify_id","product_id")
);

-- CreateIndex
CREATE INDEX "store_product_collection_with_manual_collections_product_id_idx" ON "dbt"."store_product_collection_with_manual_collections"("product_id");

-- CreateIndex
CREATE INDEX "store_product_collection_with_manual_collections_collection_idx" ON "dbt"."store_product_collection_with_manual_collections"("collection_shopify_id");
