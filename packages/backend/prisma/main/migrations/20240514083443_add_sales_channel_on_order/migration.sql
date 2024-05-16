-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "salesChannelName" "public"."SalesChannelName" NOT NULL DEFAULT 'PUBLIC';

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_salesChannelName_fkey" FOREIGN KEY ("salesChannelName") REFERENCES "public"."SalesChannel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
