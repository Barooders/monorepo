/*
  Warnings:

  - The primary key for the `store_base_product_variant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopifyId` on the `store_base_product_variant` table. All the data in the column will be lost.
  - Added the required column `shopify_id` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_variant" DROP CONSTRAINT "store_exposed_product_variant_shopify_id_fkey";

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" DROP CONSTRAINT "store_base_product_variant_pkey",
DROP COLUMN "shopifyId",
ADD COLUMN     "shopify_id" BIGINT NOT NULL,
ADD CONSTRAINT "store_base_product_variant_pkey" PRIMARY KEY ("shopify_id");

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_variant" ADD CONSTRAINT "store_exposed_product_variant_shopify_id_fkey" FOREIGN KEY ("shopify_id") REFERENCES "dbt"."store_base_product_variant"("shopify_id") ON DELETE RESTRICT ON UPDATE CASCADE;
