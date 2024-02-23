-- CreateEnum
CREATE TYPE "public"."ShipmentTimeframe" AS ENUM ('SAME_DAY', 'TWO_DAYS', 'THREE_DAYS', 'FOUR_DAYS', 'FIVE_DAYS');

-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "shipmentTimeframe" "public"."ShipmentTimeframe" DEFAULT 'FIVE_DAYS';
