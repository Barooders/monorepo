-- AlterTable
ALTER TABLE "store_exposed_product_image" ALTER COLUMN "width" DROP NOT NULL,
ALTER COLUMN "height" DROP NOT NULL,
ALTER COLUMN "position" DROP NOT NULL;
