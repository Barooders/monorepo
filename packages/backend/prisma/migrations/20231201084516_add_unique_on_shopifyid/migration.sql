/*
  Warnings:

  - A unique constraint covering the columns `[shopifyId]` on the table `store_product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "store_product_shopifyId_key" ON "dbt"."store_product"("shopifyId");

-- AddForeignKey
ALTER TABLE "dbt"."store_product_image" ADD CONSTRAINT "store_product_image_product_shopify_id_fkey" FOREIGN KEY ("product_shopify_id") REFERENCES "dbt"."store_product"("shopifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_product_tags" ADD CONSTRAINT "store_product_tags_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dbt"."store_product"("shopifyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_product_variant" ADD CONSTRAINT "store_product_variant_product_shopify_id_fkey" FOREIGN KEY ("product_shopify_id") REFERENCES "dbt"."store_product"("shopifyId") ON DELETE SET NULL ON UPDATE CASCADE;
