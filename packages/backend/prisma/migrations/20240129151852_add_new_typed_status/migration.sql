-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" ADD COLUMN     "status" "dbt"."ProductStatus" NOT NULL DEFAULT 'DRAFT';
