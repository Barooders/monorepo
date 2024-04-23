/*
  Warnings:

  - Added the required column `total_quantity` to the `store_base_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_base_product" ADD COLUMN     "gender" TEXT,
ADD COLUMN     "largest_bundle_price_in_cents" BIGINT,
ADD COLUMN     "model_year" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "total_quantity" BIGINT NOT NULL;
