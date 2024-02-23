-- CreateEnum
CREATE TYPE "public"."PriceOfferStatus" AS ENUM ('PROPOSED', 'ACCEPTED');

-- CreateTable
CREATE TABLE "public"."PriceOffer" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "customerId" UUID NOT NULL,
    "productShopifyId" TEXT NOT NULL,
    "newPrice" DOUBLE PRECISION NOT NULL,
    "status" "public"."PriceOfferStatus" NOT NULL,

    CONSTRAINT "PriceOffer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
