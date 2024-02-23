/*
  Warnings:

  - You are about to drop the column `cheapestVariantPrice` on the `store_exposed_product` table. All the data in the column will be lost.
  - You are about to drop the column `condition` on the `store_exposed_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" DROP COLUMN "cheapestVariantPrice",
DROP COLUMN "condition";
