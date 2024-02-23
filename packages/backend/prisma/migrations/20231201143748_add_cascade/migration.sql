-- DropForeignKey
ALTER TABLE "dbt"."store_product_image" DROP CONSTRAINT "store_product_image_product_shopify_id_fkey";

-- AddForeignKey
ALTER TABLE "dbt"."store_product_image" ADD CONSTRAINT "store_product_image_product_shopify_id_fkey" FOREIGN KEY ("product_shopify_id") REFERENCES "dbt"."store_product"("shopifyId") ON DELETE CASCADE ON UPDATE CASCADE;
