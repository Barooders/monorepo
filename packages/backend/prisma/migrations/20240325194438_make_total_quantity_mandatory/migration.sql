/*
  Warnings:

  - Made the column `total_quantity` on table `store_b2b_product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product" ALTER COLUMN "total_quantity" SET NOT NULL;
