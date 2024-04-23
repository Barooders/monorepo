/*
  Warnings:

  - Added the required column `total_quantity` to the `store_b2b_product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product" ADD COLUMN     "total_quantity" BIGINT NOT NULL;
