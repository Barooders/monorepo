/*
  Warnings:

  - The primary key for the `store_base_product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `store_exposed_product` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "dbt"."store_base_product_variant" DROP CONSTRAINT "store_base_product_variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product" DROP CONSTRAINT "store_exposed_product_id_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_image" DROP CONSTRAINT "store_exposed_product_image_productId_fkey";

-- DropForeignKey
ALTER TABLE "dbt"."store_exposed_product_tag" DROP CONSTRAINT "store_exposed_product_tag_product_id_fkey";

-- AlterTable
ALTER TABLE "dbt"."store_base_product" DROP CONSTRAINT "store_base_product_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "store_base_product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" DROP CONSTRAINT "store_exposed_product_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "store_exposed_product_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_image" ALTER COLUMN "productId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_tag" ALTER COLUMN "product_id" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "dbt"."store_base_product_variant" ADD CONSTRAINT "store_base_product_variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "dbt"."store_base_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product" ADD CONSTRAINT "store_exposed_product_id_fkey" FOREIGN KEY ("id") REFERENCES "dbt"."store_base_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_image" ADD CONSTRAINT "store_exposed_product_image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "dbt"."store_base_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_tag" ADD CONSTRAINT "store_exposed_product_tag_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "dbt"."store_base_product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
