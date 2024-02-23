/*
  Warnings:

  - Changed the type of `paymentSolutionCode` on the `Payment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."PaymentSolutionCode" AS ENUM ('FLOA_10X', 'FLOA_4X', 'FLOA_3X');

-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "paymentSolutionCode",
ADD COLUMN     "paymentSolutionCode" "public"."PaymentSolutionCode" NOT NULL;
