-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('EMAIL');

-- CreateEnum
CREATE TYPE "public"."NotificationName" AS ENUM ('ORDER_LINE_NOT_SHIPPED');

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "type" "public"."NotificationType" NOT NULL,
    "name" "public"."NotificationName",
    "metadata" JSONB,
    "recipientId" UUID NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "public"."Customer"("authUserId") ON DELETE RESTRICT ON UPDATE CASCADE;
