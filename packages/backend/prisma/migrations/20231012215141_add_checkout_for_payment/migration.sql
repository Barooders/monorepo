/*
  Warnings:

  - You are about to drop the column `customerEmail` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `externalCustomerId` on the `Cart` table. All the data in the column will be lost.
  - You are about to drop the column `cartId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[storeId]` on the table `Cart` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `checkoutId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."CheckoutStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'ABANDONED');

-- DropForeignKey
ALTER TABLE "public"."Payment" DROP CONSTRAINT "Payment_cartId_fkey";

-- AlterTable
ALTER TABLE "public"."Cart" DROP COLUMN "customerEmail",
DROP COLUMN "customerId",
DROP COLUMN "externalCustomerId",
ADD COLUMN     "storeId" TEXT;

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "cartId",
ADD COLUMN     "checkoutId" TEXT NOT NULL,
ADD COLUMN     "paymentAccountId" TEXT;

-- CreateTable
CREATE TABLE "public"."CheckoutLineItem" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "checkoutId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,

    CONSTRAINT "CheckoutLineItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Checkout" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "cartId" TEXT NOT NULL,
    "status" "public"."CheckoutStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_storeId_key" ON "public"."Cart"("storeId");

-- AddForeignKey
ALTER TABLE "public"."CheckoutLineItem" ADD CONSTRAINT "CheckoutLineItem_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "public"."Checkout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_paymentAccountId_fkey" FOREIGN KEY ("paymentAccountId") REFERENCES "public"."PaymentAccounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_checkoutId_fkey" FOREIGN KEY ("checkoutId") REFERENCES "public"."Checkout"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Checkout" ADD CONSTRAINT "Checkout_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
