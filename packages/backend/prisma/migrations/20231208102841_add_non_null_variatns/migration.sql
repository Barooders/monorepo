/*
  Warnings:

  - Made the column `inventoryQuantity` on table `store_exposed_product_variant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `price` on table `store_exposed_product_variant` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `store_exposed_product_variant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" ALTER COLUMN "inventoryQuantity" SET NOT NULL,
ALTER COLUMN "price" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL;
