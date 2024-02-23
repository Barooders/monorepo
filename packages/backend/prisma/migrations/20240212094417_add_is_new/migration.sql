/*
  Warnings:

  - You are about to drop the column `condition_from_variants` on the `store_product_for_analytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_product_for_analytics" ADD COLUMN     "is_new" BOOLEAN;
