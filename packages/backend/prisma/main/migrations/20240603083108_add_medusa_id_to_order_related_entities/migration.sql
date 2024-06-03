/*
  Warnings:

  - A unique constraint covering the columns `[medusaId]` on the table `Fulfillment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medusaId]` on the table `FulfillmentItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medusaId]` on the table `FulfillmentOrder` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medusaId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[medusaId]` on the table `OrderLines` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Fulfillment" ADD COLUMN     "medusaId" BIGINT;

-- AlterTable
ALTER TABLE "public"."FulfillmentItem" ADD COLUMN     "medusaId" BIGINT;

-- AlterTable
ALTER TABLE "public"."FulfillmentOrder" ADD COLUMN     "medusaId" TEXT;

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "medusaId" TEXT;

-- AlterTable
ALTER TABLE "public"."OrderLines" ADD COLUMN     "medusaId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Fulfillment_medusaId_key" ON "public"."Fulfillment"("medusaId");

-- CreateIndex
CREATE UNIQUE INDEX "FulfillmentItem_medusaId_key" ON "public"."FulfillmentItem"("medusaId");

-- CreateIndex
CREATE UNIQUE INDEX "FulfillmentOrder_medusaId_key" ON "public"."FulfillmentOrder"("medusaId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_medusaId_key" ON "public"."Order"("medusaId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderLines_medusaId_key" ON "public"."OrderLines"("medusaId");
