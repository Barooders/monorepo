-- CreateEnum
CREATE TYPE "public"."FulfillmentOrderStatus" AS ENUM ('CANCELED', 'CLOSED', 'IN_PROGRESS', 'INCOMPLETE', 'OPEN');

-- CreateEnum
CREATE TYPE "public"."FulfillmentStatus" AS ENUM ('CANCELED', 'ERROR', 'FAILURE', 'OPEN', 'PENDING', 'SUCCESS');

-- AlterTable
ALTER TABLE "public"."OrderLines" ADD COLUMN     "fulfillmentOrderId" TEXT;

-- CreateTable
CREATE TABLE "public"."FulfillmentOrder" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "shopifyId" BIGINT NOT NULL,
    "status" "public"."FulfillmentOrderStatus" NOT NULL DEFAULT 'OPEN',
    "orderId" TEXT NOT NULL,

    CONSTRAINT "FulfillmentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fulfillment" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopifyId" BIGINT NOT NULL,
    "fulfillmentOrderId" TEXT NOT NULL,
    "status" "public"."FulfillmentStatus" NOT NULL,

    CONSTRAINT "Fulfillment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FulfillmentItem" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shopifyId" BIGINT NOT NULL,
    "productVariantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "fulfillmentId" TEXT NOT NULL,

    CONSTRAINT "FulfillmentItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FulfillmentOrder_shopifyId_key" ON "public"."FulfillmentOrder"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "Fulfillment_shopifyId_key" ON "public"."Fulfillment"("shopifyId");

-- CreateIndex
CREATE UNIQUE INDEX "FulfillmentItem_shopifyId_key" ON "public"."FulfillmentItem"("shopifyId");

-- AddForeignKey
ALTER TABLE "public"."OrderLines" ADD CONSTRAINT "OrderLines_fulfillmentOrderId_fkey" FOREIGN KEY ("fulfillmentOrderId") REFERENCES "public"."FulfillmentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FulfillmentOrder" ADD CONSTRAINT "FulfillmentOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fulfillment" ADD CONSTRAINT "Fulfillment_fulfillmentOrderId_fkey" FOREIGN KEY ("fulfillmentOrderId") REFERENCES "public"."FulfillmentOrder"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FulfillmentItem" ADD CONSTRAINT "FulfillmentItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FulfillmentItem" ADD CONSTRAINT "FulfillmentItem_fulfillmentId_fkey" FOREIGN KEY ("fulfillmentId") REFERENCES "public"."Fulfillment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
