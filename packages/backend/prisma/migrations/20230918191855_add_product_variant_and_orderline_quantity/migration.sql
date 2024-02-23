-- AlterTable
ALTER TABLE "public"."OrderLines" ADD COLUMN     "productVariantId" TEXT,
ADD COLUMN     "quantity" INTEGER NOT NULL DEFAULT 1;

-- AddForeignKey
ALTER TABLE "public"."OrderLines" ADD CONSTRAINT "OrderLines_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "public"."ProductVariant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
