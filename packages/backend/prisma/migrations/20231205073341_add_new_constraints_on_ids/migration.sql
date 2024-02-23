/*
  Warnings:

  - Changed the type of `productId` on the `store_exposed_product_image` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "dbt"."store_exposed_product_image" DROP COLUMN "productId",
ADD COLUMN     "productId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "store_exposed_product_image_productId_idx" ON "dbt"."store_exposed_product_image"("productId");

-- AddForeignKey
ALTER TABLE "dbt"."store_exposed_product_image" ADD CONSTRAINT "store_exposed_product_image_productId_fkey" FOREIGN KEY ("productId") REFERENCES "dbt"."store_base_product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
