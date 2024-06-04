/*
  Warnings:

  - You are about to drop the column `shopify_id` on the `store_collection` table. All the data in the column will be lost.
  - The primary key for the `store_exposed_product_image` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `shopify_id` on the `store_exposed_product_image` table. All the data in the column will be lost.
  - You are about to drop the column `shopify_id` on the `store_product_for_analytics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[medusaId]` on the table `store_base_product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medusa_id]` on the table `store_base_product_variant` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medusa_id]` on the table `store_product_for_analytics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `medusaId` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medusa_id` to the `store_collection` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medusa_id` to the `store_exposed_product_image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medusa_id` to the `store_product_for_analytics` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "store_product_for_analytics_shopify_id_key";

-- AlterTable
ALTER TABLE "store_base_product" ADD COLUMN     "medusaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "store_base_product_variant" ADD COLUMN     "medusa_id" TEXT;

-- AlterTable
ALTER TABLE "store_collection" DROP COLUMN "shopify_id",
ADD COLUMN     "medusa_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "store_exposed_product_image" DROP CONSTRAINT "store_exposed_product_image_pkey",
DROP COLUMN "shopify_id",
ADD COLUMN     "medusa_id" TEXT NOT NULL,
ADD CONSTRAINT "store_exposed_product_image_pkey" PRIMARY KEY ("medusa_id");

-- AlterTable
ALTER TABLE "store_product_for_analytics" DROP COLUMN "shopify_id",
ADD COLUMN     "medusa_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "store_base_product_medusaId_key" ON "store_base_product"("medusaId");

-- CreateIndex
CREATE UNIQUE INDEX "store_base_product_variant_medusa_id_key" ON "store_base_product_variant"("medusa_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_product_for_analytics_medusa_id_key" ON "store_product_for_analytics"("medusa_id");
