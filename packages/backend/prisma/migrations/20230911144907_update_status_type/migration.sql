ALTER TABLE "public"."VendorProProduct" ALTER COLUMN "status" SET DATA TYPE "public"."ProductStatus" USING(UPPER(status)::"public"."ProductStatus");