/*
  Warnings:

  - You are about to drop the column `vendor_scoring` on the `store_product_for_analytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_product_for_analytics" DROP COLUMN "vendor_scoring",
ADD COLUMN     "default_vendor_notation" "dbt"."ProductNotation";
