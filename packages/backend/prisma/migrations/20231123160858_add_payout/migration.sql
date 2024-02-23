-- CreateTable
CREATE TABLE "public"."Payout" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "orderLineId" TEXT NOT NULL,
    "amountInCents" INTEGER NOT NULL,
    "currency" "public"."Currency" NOT NULL DEFAULT 'EUR',
    "destinationAccountId" TEXT NOT NULL,

    CONSTRAINT "Payout_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Payout" ADD CONSTRAINT "Payout_orderLineId_fkey" FOREIGN KEY ("orderLineId") REFERENCES "public"."OrderLines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payout" ADD CONSTRAINT "Payout_destinationAccountId_fkey" FOREIGN KEY ("destinationAccountId") REFERENCES "public"."PaymentAccounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
