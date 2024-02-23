/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `store_product_for_analytics` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "store_product_for_analytics_id_key" ON "dbt"."store_product_for_analytics"("id");

-- CreateIndex
CREATE INDEX "store_product_for_analytics_id_idx" ON "dbt"."store_product_for_analytics"("id");
