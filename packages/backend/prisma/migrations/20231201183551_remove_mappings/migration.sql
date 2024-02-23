/*
  Warnings:

  - You are about to drop the column `created_at` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `shopify_id` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `cheapest_variant_price` on the `store_exposed_product` table. All the data in the column will be lost.
  - You are about to drop the column `first_image` on the `store_exposed_product` table. All the data in the column will be lost.
  - You are about to drop the column `model_year` on the `store_exposed_product` table. All the data in the column will be lost.
  - You are about to drop the column `product_type` on the `store_exposed_product` table. All the data in the column will be lost.
  - You are about to drop the column `published_at` on the `store_exposed_product` table. All the data in the column will be lost.
  - You are about to drop the column `sync_date` on the `store_exposed_product` table. All the data in the column will be lost.
  - You are about to drop the column `product_id` on the `store_exposed_product_image` table. All the data in the column will be lost.
  - You are about to drop the column `sync_date` on the `store_exposed_product_image` table. All the data in the column will be lost.
  - You are about to drop the column `sync_date` on the `store_exposed_product_variant` table. All the data in the column will be lost.
  - Added the required column `productId` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shopifyId` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `store_exposed_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncDate` to the `store_exposed_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productId` to the `store_exposed_product_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncDate` to the `store_exposed_product_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncDate` to the `store_exposed_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "dbt"."store_base_product_variant" DROP CONSTRAINT "store_base_product_variant_product_id_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_image" DROP CONSTRAINT "store_exposed_product_image_product_id_fkey";

-- DropIndex
DROP INDEX "dbt"."store_base_product_variant_product_id_idx";

-- DropIndex
DROP INDEX "dbt"."store_exposed_product_image_product_id_idx";

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" DROP COLUMN "created_at",
DROP COLUMN "product_id",
DROP COLUMN "shopify_id",
ADD COLUMN     "createdAt" TIMESTAMPTZ(6),
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "shopifyId" BIGINT NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" DROP COLUMN "cheapest_variant_price",
DROP COLUMN "first_image",
DROP COLUMN "model_year",
DROP COLUMN "product_type",
DROP COLUMN "published_at",
DROP COLUMN "sync_date",
ADD COLUMN     "cheapestVariantPrice" DOUBLE PRECISION,
ADD COLUMN     "firstImage" VARCHAR(512),
ADD COLUMN     "modelYear" TEXT,
ADD COLUMN     "productType" VARCHAR(256) NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMPTZ(6),
ADD COLUMN     "syncDate" DATE NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_image" DROP COLUMN "product_id",
DROP COLUMN "sync_date",
ADD COLUMN     "productId" TEXT NOT NULL,
ADD COLUMN     "syncDate" DATE NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_variant" DROP COLUMN "sync_date",
ADD COLUMN     "syncDate" DATE NOT NULL;

-- CreateIndex
CREATE INDEX "store_base_product_variant_productId_idx" ON "dbt"."store_base_product_variant"("productId");

-- CreateIndex
CREATE INDEX "store_exposed_product_image_productId_idx" ON "dbt"."store_exposed_product_image"("productId");

-- AddForeignKey
ALTER TABLE "dbt"."store_base_product_variant" ADD CONSTRAINT "store_base_product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_image" ADD CONSTRAINT "store_exposed_product_image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
