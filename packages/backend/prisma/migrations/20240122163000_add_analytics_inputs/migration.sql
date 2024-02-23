-- CreateEnum
CREATE TYPE "dbt"."BrandRating" AS ENUM ('TOP', 'MID', 'LOW');

-- AlterTable
ALTER TABLE "dbt"."store_product_for_analytics" ADD COLUMN     "brand" TEXT,
ADD COLUMN     "brand_rating" "dbt"."BrandRating",
ADD COLUMN     "highest_discount" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "image_count" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "is_bike" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "modelYear" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "vendor_overrides_product_scoring" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "vendor_scoring" "dbt"."ProductScoring";
