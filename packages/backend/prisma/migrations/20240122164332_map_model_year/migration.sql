/*
  Warnings:

  - You are about to drop the column `modelYear` on the `store_product_for_analytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "dbt"."store_product_for_analytics" DROP COLUMN "modelYear",
ADD COLUMN     "model_year" INTEGER NOT NULL DEFAULT 0;
