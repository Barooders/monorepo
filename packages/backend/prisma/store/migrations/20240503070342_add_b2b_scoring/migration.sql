/*
  Warnings:

  - Added the required column `calculated_b2b_scoring` to the `store_product_for_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "store_product_for_analytics" ADD COLUMN     "calculated_b2b_scoring" DOUBLE PRECISION;
