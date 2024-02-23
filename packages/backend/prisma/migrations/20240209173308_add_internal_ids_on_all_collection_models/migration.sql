/*
  Warnings:

  - The primary key for the `store_collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `store_product_collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `store_product_collection_with_manual_collections` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `id` on table `store_collection` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `collection_internal_id` to the `store_discount_collection` table without a default value. This is not possible if the table is not empty.
  - Made the column `collection_id` on table `store_product_collection` required. This step will fail if there are existing NULL values in that column.
  - Made the column `collection_id` on table `store_product_collection_with_manual_collections` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "dbt"."store_product_collection_collection_shopify_id_idx";

-- DropIndex
DROP INDEX "dbt"."store_product_collection_with_manual_collections_collection_idx";

-- AlterTable
ALTER TABLE "dbt"."store_collection" DROP CONSTRAINT "store_collection_pkey",
ALTER COLUMN "id" SET NOT NULL,
ADD CONSTRAINT "store_collection_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbt"."store_discount_collection" ADD COLUMN     "collection_internal_id" TEXT;

-- AlterTable
ALTER TABLE "dbt"."store_product_collection" DROP CONSTRAINT "store_product_collection_pkey",
ALTER COLUMN "collection_id" SET NOT NULL,
ADD CONSTRAINT "store_product_collection_pkey" PRIMARY KEY ("collection_id", "product_id");

-- AlterTable
ALTER TABLE "dbt"."store_product_collection_with_manual_collections" DROP CONSTRAINT "store_product_collection_with_manual_collections_pkey",
ALTER COLUMN "collection_id" SET NOT NULL,
ADD CONSTRAINT "store_product_collection_with_manual_collections_pkey" PRIMARY KEY ("collection_id", "product_id");

-- CreateIndex
CREATE INDEX "store_product_collection_collection_id_idx" ON "dbt"."store_product_collection"("collection_id");

-- CreateIndex
CREATE INDEX "store_product_collection_with_manual_collections_collection_idx" ON "dbt"."store_product_collection_with_manual_collections"("collection_id");
