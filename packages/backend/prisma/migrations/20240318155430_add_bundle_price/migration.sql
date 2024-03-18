-- CreateTable
CREATE TABLE "public"."BundlePrice" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "minQuantity" INTEGER NOT NULL,
    "unitPriceInCents" BIGINT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "BundlePrice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."BundlePrice" ADD CONSTRAINT "BundlePrice_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
