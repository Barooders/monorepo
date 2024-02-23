/*
  Warnings:

  - The values [FEEDBACK_REQUESTED] on the enum `NotificationName` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."NotificationName_new" AS ENUM ('ORDER_LINE_NOT_SHIPPED', 'ORDER_REFUNDED', 'HAND_DELIVERY_VALIDATED', 'HAND_DELIVERY_PROCEDURE', 'MANUAL_PAYMENT_PROCEDURE', 'NEW_ORDER_FOR_VENDOR_WITH_BAROODERS_SHIPPING', 'NEW_ORDER_FOR_VENDOR_WITH_OWN_SHIPPING', 'NEW_ORDER_PAID', 'FEEDBACK_ASKED');
ALTER TABLE "public"."Notification" ALTER COLUMN "name" TYPE "public"."NotificationName_new" USING ("name"::text::"public"."NotificationName_new");
ALTER TYPE "public"."NotificationName" RENAME TO "NotificationName_old";
ALTER TYPE "public"."NotificationName_new" RENAME TO "NotificationName";
DROP TYPE "public"."NotificationName_old";
COMMIT;
