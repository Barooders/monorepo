-- CreateTable
CREATE TABLE "dbt"."store_discount_product" (
    "discount_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "syncDate" DATE NOT NULL,

    CONSTRAINT "store_discount_product_pkey" PRIMARY KEY ("discount_id","product_id")
);

-- CreateIndex
CREATE INDEX "store_discount_product_product_id_idx" ON "dbt"."store_discount_product"("product_id");

-- CreateIndex
CREATE INDEX "store_discount_product_discount_id_idx" ON "dbt"."store_discount_product"("discount_id");
