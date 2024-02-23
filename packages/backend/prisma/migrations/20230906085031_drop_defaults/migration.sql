-- AlterTable
ALTER TABLE "public"."Order" ALTER COLUMN "shippingAddressAddress1" DROP DEFAULT,
ALTER COLUMN "shippingAddressCity" DROP DEFAULT,
ALTER COLUMN "shippingAddressCountry" DROP DEFAULT,
ALTER COLUMN "shippingAddressFirstName" DROP DEFAULT,
ALTER COLUMN "shippingAddressLastName" DROP DEFAULT,
ALTER COLUMN "shippingAddressZip" DROP DEFAULT,
ALTER COLUMN "totalPriceCurrency" DROP DEFAULT,
ALTER COLUMN "totalPriceInCents" DROP DEFAULT;

-- AlterTable
ALTER TABLE "public"."OrderLines" ALTER COLUMN "priceCurrency" DROP DEFAULT,
ALTER COLUMN "priceInCents" DROP DEFAULT,
ALTER COLUMN "name" DROP DEFAULT,
ALTER COLUMN "productCondition" DROP DEFAULT,
ALTER COLUMN "productHandle" DROP DEFAULT,
ALTER COLUMN "productImage" DROP DEFAULT,
ALTER COLUMN "productType" DROP DEFAULT;
