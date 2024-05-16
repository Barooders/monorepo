-- AlterTable
ALTER TABLE "public"."PriceOffer" ADD COLUMN     "orderId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
