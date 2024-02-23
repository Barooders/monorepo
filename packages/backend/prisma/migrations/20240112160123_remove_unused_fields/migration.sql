/*
  Warnings:

  - You are about to drop the column `scoring` on the `store_exposed_product` table. All the data in the column will be lost.
  - You are about to drop the column `views_last_30_days` on the `store_exposed_product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" DROP COLUMN "scoring",
DROP COLUMN "views_last_30_days";
