/*
  Warnings:

  - You are about to drop the column `amount` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `amountInCents` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Payment" DROP COLUMN "amount",
ADD COLUMN     "amountInCents" INTEGER NOT NULL;
