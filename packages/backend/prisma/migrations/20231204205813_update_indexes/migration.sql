-- DropIndex
DROP INDEX "dbt"."store_exposed_product_variant_shopify_id_idx";

-- CreateIndex
CREATE INDEX "store_exposed_product_tag_product_id_idx" ON "dbt"."store_exposed_product_tag"("product_id");
