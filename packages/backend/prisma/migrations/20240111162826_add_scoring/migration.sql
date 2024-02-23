/*
  Warnings:

  - Added the required column `scoring` to the `store_product_for_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_product_for_analytics" ADD COLUMN     "scoring" DOUBLE PRECISION NOT NULL;
