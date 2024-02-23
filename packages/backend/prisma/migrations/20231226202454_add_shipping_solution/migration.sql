-- CreateEnum
CREATE TYPE "public"."ShippingSolution" AS ENUM ('HAND_DELIVERY', 'VENDOR', 'GEODIS', 'SENDCLOUD');

-- AlterTable
ALTER TABLE "public"."OrderLines" ADD COLUMN     "shippingSolution" "public"."ShippingSolution";
