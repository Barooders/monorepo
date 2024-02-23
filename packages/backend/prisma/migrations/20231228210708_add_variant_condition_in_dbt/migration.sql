-- CreateEnum
CREATE TYPE "dbt"."Condition" AS ENUM ('AS_NEW', 'VERY_GOOD', 'GOOD');

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" ADD COLUMN     "condition" "dbt"."Condition";
