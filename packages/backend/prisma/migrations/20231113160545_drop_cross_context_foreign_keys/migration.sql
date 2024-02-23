-- DropForeignKey
ALTER TABLE "public"."FulfillmentItem" DROP CONSTRAINT "FulfillmentItem_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrderLines" DROP CONSTRAINT "OrderLines_productVariantId_fkey";
