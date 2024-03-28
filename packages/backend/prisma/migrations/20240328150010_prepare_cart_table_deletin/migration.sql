-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'YOUNITED_24x';
ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'YOUNITED_10x';
ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'YOUNITED_36x';
ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'BANK_WIRE';
ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'PAYPAL';
ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'CREDIT_CARD';
ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'ALMA_2X';
ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'ALMA_3X';
ALTER TYPE "public"."PaymentSolutionCode" ADD VALUE 'ALMA_4X';

-- AlterTable
ALTER TABLE "public"."Checkout" ADD COLUMN     "storeId" TEXT;
