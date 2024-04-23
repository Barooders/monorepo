/*
  Warnings:

  - You are about to drop the column `firstImage` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfViews` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `productType` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `syncDate` on the `store_base_product` table. All the data in the column will be lost.
  - You are about to drop the column `compareAtPrice` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `inventoryQuantity` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `isRefurbished` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option1` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option1Name` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option2` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option2Name` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option3` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `option3Name` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `requiresShipping` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `syncDate` on the `store_base_product_variant` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `store_base_product_variant` table. All the data in the column will be lost.
  - Added the required column `product_type` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sync_date` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventory_quantity` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sync_date` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_base_product" DROP COLUMN "firstImage",
DROP COLUMN "numberOfViews",
DROP COLUMN "productType",
DROP COLUMN "syncDate",
ADD COLUMN     "first_image" VARCHAR(512),
ADD COLUMN     "number_of_views" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "product_type" VARCHAR(256) NOT NULL,
ADD COLUMN     "sync_date" DATE NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" DROP COLUMN "compareAtPrice",
DROP COLUMN "inventoryQuantity",
DROP COLUMN "isRefurbished",
DROP COLUMN "option1",
DROP COLUMN "option1Name",
DROP COLUMN "option2",
DROP COLUMN "option2Name",
DROP COLUMN "option3",
DROP COLUMN "option3Name",
DROP COLUMN "requiresShipping",
DROP COLUMN "syncDate",
DROP COLUMN "updatedAt",
ADD COLUMN     "compare_at_price" DOUBLE PRECISION,
ADD COLUMN     "inventory_quantity" BIGINT NOT NULL,
ADD COLUMN     "is_refurbished" BOOLEAN,
ADD COLUMN     "option_1" VARCHAR(256),
ADD COLUMN     "option_1_name" VARCHAR(256),
ADD COLUMN     "option_2" VARCHAR(256),
ADD COLUMN     "option_2_name" VARCHAR(256),
ADD COLUMN     "option_3" VARCHAR(256),
ADD COLUMN     "option_3_name" VARCHAR(256),
ADD COLUMN     "requires_shipping" BOOLEAN,
ADD COLUMN     "sync_date" DATE NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMPTZ(6) NOT NULL;
