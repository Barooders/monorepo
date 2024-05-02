-- CreateTable
CREATE TABLE "public"."CustomerRequest" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "budgetMinInCents" INTEGER,
    "budgetMaxInCents" INTEGER,
    "neededAtDate" TIMESTAMP(3) NOT NULL,
    "customerId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "CustomerRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CustomerRequest" ADD CONSTRAINT "CustomerRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
