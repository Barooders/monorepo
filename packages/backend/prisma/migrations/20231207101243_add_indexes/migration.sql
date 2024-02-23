-- CreateIndex
CREATE INDEX "store_exposed_product_id_idx" ON "dbt"."store_exposed_product"("id");

-- CreateIndex
CREATE INDEX "store_exposed_product_variant_shopify_id_idx" ON "dbt"."store_exposed_product_variant"("shopify_id");
