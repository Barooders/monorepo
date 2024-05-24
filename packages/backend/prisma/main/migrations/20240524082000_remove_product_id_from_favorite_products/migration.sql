/*
  Warnings:

  - You are about to drop the column `productId` on the `FavoriteProducts` table. All the data in the column will be lost.
  - Made the column `internalProductId` on table `FavoriteProducts` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."FavoriteProducts" DROP COLUMN "productId",
ALTER COLUMN "internalProductId" SET NOT NULL;
