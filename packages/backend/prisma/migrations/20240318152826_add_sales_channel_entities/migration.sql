-- CreateEnum
CREATE TYPE "public"."SalesChannelName" AS ENUM ('PUBLIC', 'B2B');

-- CreateTable
CREATE TABLE "public"."SalesChannel" (
    "name" "public"."SalesChannelName" NOT NULL,

    CONSTRAINT "SalesChannel_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "public"."ProductSalesChannel" (
    "salesChannelName" "public"."SalesChannelName" NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductSalesChannel_pkey" PRIMARY KEY ("salesChannelName","productId")
);

-- AddForeignKey
ALTER TABLE "public"."ProductSalesChannel" ADD CONSTRAINT "ProductSalesChannel_salesChannelName_fkey" FOREIGN KEY ("salesChannelName") REFERENCES "public"."SalesChannel"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ProductSalesChannel" ADD CONSTRAINT "ProductSalesChannel_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
