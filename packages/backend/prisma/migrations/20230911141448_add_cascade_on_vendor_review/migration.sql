-- DropForeignKey
ALTER TABLE "public"."VendorReview" DROP CONSTRAINT "VendorReview_reviewId_fkey";

-- AddForeignKey
ALTER TABLE "public"."VendorReview" ADD CONSTRAINT "VendorReview_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "public"."Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;
