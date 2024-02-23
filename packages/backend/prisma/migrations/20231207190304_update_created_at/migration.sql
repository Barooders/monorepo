/*
  Warnings:

  - You are about to drop the column `createdAt` on the `store_exposed_product_variant` table. All the data in the column will be lost.
  - Made the column `createdAt` on table `store_base_product_variant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" ALTER COLUMN "createdAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" DROP COLUMN "createdAt";
