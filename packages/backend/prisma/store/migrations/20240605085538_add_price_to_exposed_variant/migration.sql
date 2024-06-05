/*
  Warnings:

  - Added the required column `price` to the `store_exposed_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_exposed_product_variant" ADD COLUMN     "compare_at_price" DOUBLE PRECISION,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL;
