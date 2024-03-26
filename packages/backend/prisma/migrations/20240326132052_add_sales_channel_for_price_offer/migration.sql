-- AlterTable
ALTER TABLE "public"."PriceOffer" ADD COLUMN     "salesChannelName" "public"."SalesChannelName" NOT NULL DEFAULT 'PUBLIC';

-- AddForeignKey
ALTER TABLE "public"."PriceOffer" ADD CONSTRAINT "PriceOffer_salesChannelName_fkey" FOREIGN KEY ("salesChannelName") REFERENCES "public"."SalesChannel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
