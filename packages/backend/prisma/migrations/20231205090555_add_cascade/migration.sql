-- DropForeignKey
ALTER TABLE "dbt"."store_base_product_variant" DROP CONSTRAINT "store_base_product_variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product" DROP CONSTRAINT "store_exposed_product_id_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_image" DROP CONSTRAINT "store_exposed_product_image_productId_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_tag" DROP CONSTRAINT "store_exposed_product_tag_product_id_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_variant" DROP CONSTRAINT "store_exposed_product_variant_shopify_id_fkey";

-- AddForeignKey
ALTER TABLE "dbt"."store_base_product_variant" ADD CONSTRAINT "store_base_product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "dbt"."store_base_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product" ADD CONSTRAINT "store_exposed_product_id_fkey" FOREIGN KEY ("id") REFERENCES "dbt"."store_base_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_variant" ADD CONSTRAINT "store_exposed_product_variant_shopify_id_fkey" FOREIGN KEY ("shopify_id") REFERENCES "dbt"."store_base_product_variant"("shopify_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_image" ADD CONSTRAINT "store_exposed_product_image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "dbt"."store_base_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_tag" ADD CONSTRAINT "store_exposed_product_tag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dbt"."store_base_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
