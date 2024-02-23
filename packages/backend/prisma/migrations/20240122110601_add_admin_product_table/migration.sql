-- CreateTable
CREATE TABLE "dbt"."store_product_for_admin" (
    "id" TEXT NOT NULL,
    "sourceUrl" TEXT,

    CONSTRAINT "store_product_for_admin_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "store_product_for_admin_id_idx" ON "dbt"."store_product_for_admin"("id");
