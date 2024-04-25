/*
  Warnings:

  - The primary key for the `store_base_product_variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[shopify_id]` on the table `store_base_product_variant` will be added. If there are existing duplicate values, this will fail.
  - Made the column `id` on table `store_base_product_variant` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "dbt"."store_b2b_product_variant" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "dbt"."store_b2c_product_variant" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" DROP CONSTRAINT "store_base_product_variant_pkey",
ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "store_base_product_variant_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" ALTER COLUMN "id" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "store_base_product_variant_shopify_id_key" ON "dbt"."store_base_product_variant"("shopify_id");
