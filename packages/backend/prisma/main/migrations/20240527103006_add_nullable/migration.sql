-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "shopifyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."ProductVariant" ALTER COLUMN "shopifyId" DROP NOT NULL;
