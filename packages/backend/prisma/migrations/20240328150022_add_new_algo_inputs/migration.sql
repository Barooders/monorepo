-- AlterTable
ALTER TABLE "dbt"."store_product_for_analytics" ADD COLUMN     "favorites_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "orders_count" INTEGER NOT NULL DEFAULT 0;
