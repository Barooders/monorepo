/*
  Warnings:

  - The `vendor_scoring` column on the `store_product_for_analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_product_for_analytics" DROP COLUMN "vendor_scoring",
ADD COLUMN     "vendor_scoring" "dbt"."ProductNotation";

-- DropEnum
DROP TYPE "dbt"."ProductScoring";
