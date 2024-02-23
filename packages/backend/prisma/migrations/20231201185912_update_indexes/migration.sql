/*
  Warnings:

  - The primary key for the `store_base_product_variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `store_exposed_product_variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `store_exposed_product_variant` table. All the data in the column will be lost.
  - Added the required column `shopify_id` to the `store_exposed_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_variant" DROP CONSTRAINT "store_exposed_product_variant_id_fkey";

-- DropIndex
DROP INDEX "dbt"."store_exposed_product_tag_product_id_idx";

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" DROP CONSTRAINT "store_base_product_variant_pkey",
ALTER COLUMN "id" DROP NOT NULL,
ADD CONSTRAINT "store_base_product_variant_pkey" PRIMARY KEY ("shopifyId");

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" DROP CONSTRAINT "store_exposed_product_variant_pkey",
DROP COLUMN "id",
ADD COLUMN     "shopify_id" BIGINT NOT NULL,
ADD CONSTRAINT "store_exposed_product_variant_pkey" PRIMARY KEY ("shopify_id");

-- CreateIndex
CREATE INDEX "store_base_product_variant_id_idx" ON "dbt"."store_base_product_variant"("id");

-- CreateIndex
CREATE INDEX "store_exposed_product_variant_shopify_id_idx" ON "dbt"."store_exposed_product_variant"("shopify_id");

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_variant" ADD CONSTRAINT "store_exposed_product_variant_shopify_id_fkey" FOREIGN KEY ("shopify_id") REFERENCES "dbt"."store_base_product_variant"("shopifyId") ON DELETE RESTRICT ON UPDATE CASCADE;
