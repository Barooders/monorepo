/*
  Warnings:

  - You are about to drop the column `variantId` on the `CheckoutLineItem` table. All the data in the column will be lost.
  - Added the required column `productId` to the `CheckoutLineItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."CheckoutLineItem" DROP COLUMN "variantId",
ADD COLUMN     "productId" TEXT NOT NULL;
