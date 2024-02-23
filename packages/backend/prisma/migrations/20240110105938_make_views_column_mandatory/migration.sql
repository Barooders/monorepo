/*
  Warnings:

  - Made the column `views_last_30_days` on table `store_exposed_product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" ALTER COLUMN "views_last_30_days" SET NOT NULL,
ALTER COLUMN "views_last_30_days" SET DEFAULT 0;
