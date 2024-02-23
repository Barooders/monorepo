-- CreateEnum
CREATE TYPE "dbt"."ProductScoring" AS ENUM ('A', 'B', 'C');

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" ADD COLUMN     "scoring" "dbt"."ProductScoring";
