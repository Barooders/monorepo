-- DropForeignKey
ALTER TABLE "public"."Checkout" DROP CONSTRAINT "Checkout_cartId_fkey";

-- AlterTable
ALTER TABLE "public"."Checkout" ALTER COLUMN "cartId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Checkout" ADD CONSTRAINT "Checkout_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "public"."Cart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
