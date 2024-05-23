-- AlterTable
ALTER TABLE "public"."FavoriteProducts" ADD COLUMN     "internalProductId" TEXT;

ALTER TABLE "public"."FavoriteProducts" ADD CONSTRAINT "FavoriteProducts_internalProductId_fkey" FOREIGN KEY ("internalProductId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

UPDATE "FavoriteProducts" SET "internalProductId" = "Product".id
    FROM "Product" WHERE "productId" = "Product"."shopifyId";

