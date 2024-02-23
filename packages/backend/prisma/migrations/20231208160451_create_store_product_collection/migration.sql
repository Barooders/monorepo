-- CreateTable
CREATE TABLE "dbt"."store_product_collection" (
    "collection_id" BIGINT NOT NULL,
    "productId" TEXT NOT NULL,
    "syncDate" DATE NOT NULL
);

-- CreateIndex
CREATE INDEX "store_product_collection_productId_idx" ON "dbt"."store_product_collection"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_collection_collection_id_productId_key" ON "dbt"."store_product_collection"("collection_id", "productId");
