-- CreateIndex
CREATE INDEX "store_exposed_product_brand_idx" ON "dbt"."store_exposed_product"("brand");

-- CreateIndex
CREATE INDEX "store_exposed_product_title_idx" ON "dbt"."store_exposed_product"("title");

-- CreateIndex
CREATE INDEX "store_exposed_product_model_idx" ON "dbt"."store_exposed_product"("model");

-- CreateIndex
CREATE INDEX "store_exposed_product_productType_idx" ON "dbt"."store_exposed_product"("productType");

-- CreateIndex
CREATE INDEX "store_exposed_product_gender_idx" ON "dbt"."store_exposed_product"("gender");

-- CreateIndex
CREATE INDEX "store_exposed_product_vendor_idx" ON "dbt"."store_exposed_product"("vendor");
