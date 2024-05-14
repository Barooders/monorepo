-- AlterTable
ALTER TABLE "public"."Fulfillment" ALTER COLUMN "shopifyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."FulfillmentOrder" ALTER COLUMN "shopifyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "shopifyId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."OrderLines" ALTER COLUMN "shopifyId" DROP NOT NULL;
