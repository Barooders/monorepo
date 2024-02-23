/*
  Warnings:

  - You are about to drop the column `orderId` on the `Checkout` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[checkoutId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."Checkout" DROP CONSTRAINT "Checkout_orderId_fkey";

-- AlterTable
ALTER TABLE "public"."Checkout" DROP COLUMN "orderId";

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "checkoutId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_checkoutId_key" ON "public"."Order"("checkoutId");

-- AddForeignKey
ALTER TABLE "public"."Order" ADD CONSTRAINT "Order_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "public"."Checkout"("id") ON DELETE SET NULL ON UPDATE CASCADE;
