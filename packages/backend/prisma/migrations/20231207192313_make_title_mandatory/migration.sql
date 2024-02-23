/*
  Warnings:

  - Made the column `title` on table `store_exposed_product_variant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" ALTER COLUMN "title" SET NOT NULL;
