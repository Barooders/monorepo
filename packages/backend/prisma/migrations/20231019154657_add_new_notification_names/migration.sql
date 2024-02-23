-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."NotificationName" ADD VALUE 'HAND_DELIVERY_PROCEDURE';
ALTER TYPE "public"."NotificationName" ADD VALUE 'MANUAL_PAYMENT_PROCEDURE';
ALTER TYPE "public"."NotificationName" ADD VALUE 'NEW_ORDER_FOR_VENDOR';
ALTER TYPE "public"."NotificationName" ADD VALUE 'NEW_ORDER_FOR_VENDOR_WITH_OWN_SHIPPING';
