-- CreateEnum
CREATE TYPE "public"."OrderStatus" AS ENUM ('CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'PAID_OUT', 'CANCELED', 'RETURNED');

-- AlterTable
ALTER TABLE "public"."Order" ADD COLUMN     "status" "public"."OrderStatus" NOT NULL DEFAULT 'CREATED';
