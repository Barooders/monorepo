/*
  Warnings:

  - You are about to drop the column `compareAtPrice` on the `store_b2b_product_variant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product_variant" DROP COLUMN "compareAtPrice",
ADD COLUMN     "compare_at_price" DOUBLE PRECISION;
