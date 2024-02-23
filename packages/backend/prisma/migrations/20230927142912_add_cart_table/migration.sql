/*
  Warnings:

  - You are about to drop the column `checkoutId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `cartId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "public"."AggregateName" ADD VALUE 'CART';

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "checkoutId",
DROP COLUMN "customerId",
ADD COLUMN     "cartId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "public"."Cart" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "customerId" TEXT,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
