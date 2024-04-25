-- AlterTable
ALTER TABLE "dbt"."store_b2b_product_variant" ADD COLUMN     "id" TEXT NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE "dbt"."store_b2c_product_variant" ADD COLUMN     "id" TEXT NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" ADD COLUMN     "id" TEXT NOT NULL DEFAULT '0';
