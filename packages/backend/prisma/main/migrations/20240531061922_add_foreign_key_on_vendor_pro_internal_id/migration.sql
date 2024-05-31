-- AddForeignKey
ALTER TABLE "public"."VendorProProduct" ADD CONSTRAINT "VendorProProduct_internalId_fkey" FOREIGN KEY ("internalId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
