-- CreateEnum
CREATE TYPE "public"."PaymentStatusType" AS ENUM ('STARTED', 'REFUSED', 'VALIDATED');

-- CreateTable
CREATE TABLE "public"."Payment" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "paymentSolutionCode" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL,
    "status" "public"."PaymentStatusType" NOT NULL,
    "customerId" TEXT NOT NULL,
    "checkoutId" TEXT NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);
