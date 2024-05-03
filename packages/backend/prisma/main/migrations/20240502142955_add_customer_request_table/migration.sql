-- CreateTable
CREATE TABLE "public"."CustomerRequest" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "quantity" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "budget_min_in_cents" INTEGER,
    "budget_max_in_cents" INTEGER,
    "needed_at_date" TIMESTAMP(3) NOT NULL,
    "customer_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "CustomerRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."CustomerRequest" ADD CONSTRAINT "CustomerRequest_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
