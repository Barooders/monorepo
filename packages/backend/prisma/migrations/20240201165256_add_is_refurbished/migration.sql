-- AlterEnum
ALTER TYPE "dbt"."Condition" ADD VALUE 'REFURBISHED_AS_NEW';

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" ADD COLUMN     "isRefurbished" BOOLEAN;
