/*
  Warnings:

  - The primary key for the `store_discount_product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `discount_id` on the `store_discount_product` table. All the data in the column will be lost.
  - Added the required column `discount_title` to the `store_discount_product` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "dbt"."store_discount_product_discount_id_idx";

-- AlterTable
ALTER TABLE "dbt"."store_discount_product" DROP CONSTRAINT "store_discount_product_pkey",
DROP COLUMN "discount_id",
ADD COLUMN     "discount_title" TEXT NOT NULL,
ADD CONSTRAINT "store_discount_product_pkey" PRIMARY KEY ("discount_title", "product_id");

-- CreateIndex
CREATE INDEX "store_discount_product_discount_title_idx" ON "dbt"."store_discount_product"("discount_title");
