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
