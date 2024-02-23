-- AlterTable
ALTER TABLE "dbt"."store_product_collection" ADD COLUMN     "collection_id" TEXT;

-- AlterTable
ALTER TABLE "dbt"."store_product_collection_with_manual_collections" ADD COLUMN     "collection_id" TEXT;
