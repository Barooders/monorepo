/*
  Warnings:

  - You are about to drop the column `shopifyId` on the `store_product_image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shopify_id]` on the table `store_product_image` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shopify_id` to the `store_product_image` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "dbt"."store_discount_id_idx";

-- DropIndex
DROP INDEX "dbt"."store_product_image_shopifyId_key";

-- AlterTable
ALTER TABLE "dbt"."store_product_image" DROP COLUMN "shopifyId",
ADD COLUMN     "shopify_id" BIGINT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "store_product_image_shopify_id_key" ON "dbt"."store_product_image"("shopify_id");
