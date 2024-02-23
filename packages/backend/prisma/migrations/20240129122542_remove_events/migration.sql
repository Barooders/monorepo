/*
  Warnings:

  - The values [PAYMENT_REFUSED,PAYMENT_VALIDATED] on the enum `EventName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."EventName_new" AS ENUM ('USER_CREATED', 'PRODUCT_CREATED', 'PRODUCT_UPDATED', 'PRODUCT_DELETED', 'PRODUCT_REFUSED', 'VENDOR_CREATED', 'VENDOR_CONFIG_UPDATED', 'VENDOR_PRODUCTS_UPDATED', 'VENDOR_PRODUCTS_STOCK_UPDATED', 'DISCOUNT_CREATED', 'CUSTOMER_CREATED', 'PRICE_OFFER_CREATED', 'PRICE_OFFER_STATUS_UPDATED', 'SEARCH_ALERT_SENT', 'CHAT_STARTED', 'FAVORITE_PRODUCT_CREATED', 'SUPPORT_REQUEST_CREATED', 'ADD_TO_CART', 'REMOVE_FROM_CART', 'BEGIN_CHECKOUT', 'ABANDONED_CHECKOUT', 'ORDER_CREATED', 'ORDER_PAID', 'ORDER_LINE_LABELED', 'ORDER_LINE_SHIPPED', 'ORDER_LINE_RECEIVED', 'ORDER_LINE_REFUNDED', 'ORDER_FULFILLED', 'VENDOR_PAYOUT', 'ORDER_UPDATED', 'ORDER_LINE_CREATED_ON_VENDOR_SHOP', 'PAYMENT_STARTED', 'PAYMENT_STATUS_UPDATED');
ALTER TABLE "public"."Event" ALTER COLUMN "name" TYPE "public"."EventName_new" USING ("name"::text::"public"."EventName_new");
ALTER TYPE "public"."EventName" RENAME TO "EventName_old";
ALTER TYPE "public"."EventName_new" RENAME TO "EventName";
DROP TYPE "public"."EventName_old";
COMMIT;
