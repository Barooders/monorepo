/*
  Warnings:

  - A unique constraint covering the columns `[chatId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Customer" ADD COLUMN     "chatId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_chatId_key" ON "public"."Customer"("chatId");
