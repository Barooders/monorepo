-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "preferredPaymentProvider" "public"."PaymentProvider" NOT NULL DEFAULT 'STRIPE';
