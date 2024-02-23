-- DropForeignKey
ALTER TABLE "dbt"."store_product_image" DROP CONSTRAINT "store_product_image_product_shopify_id_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_product_tags" DROP CONSTRAINT "store_product_tags_product_id_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_product_variant" DROP CONSTRAINT "store_product_variant_product_shopify_id_fkey";
