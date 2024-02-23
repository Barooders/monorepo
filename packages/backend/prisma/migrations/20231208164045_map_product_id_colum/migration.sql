/*
  Warnings:

  - The primary key for the `store_product_collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `productId` on the `store_product_collection` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `store_product_collection` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "dbt"."store_product_collection_productId_idx";

-- AlterTable
ALTER TABLE "dbt"."store_product_collection" DROP CONSTRAINT "store_product_collection_pkey",
DROP COLUMN "productId",
ADD COLUMN     "product_id" TEXT NOT NULL,
ADD CONSTRAINT "store_product_collection_pkey" PRIMARY KEY ("collection_shopify_id", "product_id");

-- CreateIndex
CREATE INDEX "store_product_collection_product_id_idx" ON "dbt"."store_product_collection"("product_id");
