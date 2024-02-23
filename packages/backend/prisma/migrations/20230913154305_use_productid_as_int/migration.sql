UPDATE "public"."FavoriteProducts" SET "productIdInt"=CAST("productId" AS BIGINT);
ALTER TABLE "public"."FavoriteProducts" DROP COLUMN "productId";
ALTER TABLE "public"."FavoriteProducts" RENAME COLUMN "productIdInt" TO "productId";