-- CreateIndex
CREATE INDEX "Dispute_orderLineId_idx" ON "public"."Dispute"("orderLineId");

-- CreateIndex
CREATE INDEX "Fulfillment_fulfillmentOrderId_idx" ON "public"."Fulfillment"("fulfillmentOrderId");

-- CreateIndex
CREATE INDEX "FulfillmentOrder_orderId_idx" ON "public"."FulfillmentOrder"("orderId");

-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "public"."Order"("createdAt");

-- CreateIndex
CREATE INDEX "OrderLines_orderId_idx" ON "public"."OrderLines"("orderId");

-- CreateIndex
CREATE INDEX "PaymentAccounts_customerId_idx" ON "public"."PaymentAccounts"("customerId");

-- CreateIndex
CREATE INDEX "Payout_orderLineId_idx" ON "public"."Payout"("orderLineId");
