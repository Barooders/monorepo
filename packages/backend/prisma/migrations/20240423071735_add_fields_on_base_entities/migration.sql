/*
  Warnings:

  - Added the required column `handle` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productType` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncDate` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `store_base_product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inventoryQuantity` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `syncDate` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `store_base_product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "dbt"."store_base_product" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "description" VARCHAR(131072),
ADD COLUMN     "firstImage" VARCHAR(512),
ADD COLUMN     "handle" VARCHAR(256) NOT NULL,
ADD COLUMN     "model" TEXT,
ADD COLUMN     "numberOfViews" BIGINT NOT NULL DEFAULT 0,
ADD COLUMN     "productType" VARCHAR(256) NOT NULL,
ADD COLUMN     "publishedAt" TIMESTAMPTZ(6),
ADD COLUMN     "status" "dbt"."ProductStatus" NOT NULL,
ADD COLUMN     "syncDate" DATE NOT NULL,
ADD COLUMN     "title" VARCHAR(256) NOT NULL;

-- AlterTable
ALTER TABLE "dbt"."store_base_product_variant" ADD COLUMN     "compareAtPrice" DOUBLE PRECISION,
ADD COLUMN     "condition" "dbt"."Condition",
ADD COLUMN     "inventoryQuantity" BIGINT NOT NULL,
ADD COLUMN     "isRefurbished" BOOLEAN,
ADD COLUMN     "option1" VARCHAR(256),
ADD COLUMN     "option1Name" VARCHAR(256),
ADD COLUMN     "option2" VARCHAR(256),
ADD COLUMN     "option2Name" VARCHAR(256),
ADD COLUMN     "option3" VARCHAR(256),
ADD COLUMN     "option3Name" VARCHAR(256),
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "requiresShipping" BOOLEAN,
ADD COLUMN     "syncDate" DATE NOT NULL,
ADD COLUMN     "title" VARCHAR(256) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) NOT NULL;
