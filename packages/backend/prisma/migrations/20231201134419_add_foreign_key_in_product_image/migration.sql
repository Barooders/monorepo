-- AddForeignKey
ALTER TABLE "dbt"."store_product_image" ADD CONSTRAINT "store_product_image_product_shopify_id_fkey" FOREIGN KEY ("product_shopify_id") REFERENCES "dbt"."store_product"("shopifyId") ON DELETE RESTRICT ON UPDATE CASCADE;
