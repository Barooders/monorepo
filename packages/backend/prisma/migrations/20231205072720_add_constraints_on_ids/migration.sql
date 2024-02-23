/*
  Warnings:

  - The primary key for the `store_base_product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `store_base_product_variant` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `store_exposed_product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `store_base_product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `productId` on the `store_base_product_variant` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `id` on the `store_exposed_product` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `product_id` on the `store_exposed_product_tag` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "dbt"."store_base_product_variant" DROP CONSTRAINT "store_base_product_variant_productId_fkey" CASCADE;

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product" DROP CONSTRAINT "store_exposed_product_id_fkey" CASCADE;

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_tag" DROP CONSTRAINT "store_exposed_product_tag_product_id_fkey" CASCADE;

-- AlterTable
ALTER TABLE "dbt"."store_base_product" DROP CONSTRAINT "store_base_product_pkey" CASCADE,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "store_base_product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" DROP COLUMN "id",
ADD COLUMN     "id" UUID,
DROP COLUMN "productId",
ADD COLUMN     "productId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" DROP CONSTRAINT "store_exposed_product_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "store_exposed_product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_tag" DROP COLUMN "product_id",
ADD COLUMN     "product_id" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "store_base_product_variant_productId_idx" ON "dbt"."store_base_product_variant"("productId");

-- CreateIndex
CREATE INDEX "store_base_product_variant_id_idx" ON "dbt"."store_base_product_variant"("id");

-- CreateIndex
CREATE INDEX "store_exposed_product_tag_product_id_idx" ON "dbt"."store_exposed_product_tag"("product_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_exposed_product_tag_product_id_full_tag_key" ON "dbt"."store_exposed_product_tag"("product_id", "full_tag");

-- AddForeignKey
ALTER TABLE "dbt"."store_base_product_variant" ADD CONSTRAINT "store_base_product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product" ADD CONSTRAINT "store_exposed_product_id_fkey" FOREIGN KEY ("id") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_tag" ADD CONSTRAINT "store_exposed_product_tag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
