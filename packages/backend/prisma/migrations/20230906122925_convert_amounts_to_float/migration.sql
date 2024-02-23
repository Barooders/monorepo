-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "totalPriceInCents" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."OrderLines" ALTER COLUMN "priceInCents" SET DATA TYPE DOUBLE PRECISION;
