/*
  Warnings:

  - You are about to drop the column `status` on the `store_exposed_product` table. All the data in the column will be lost.
  - Added the required column `oldStatus` to the `store_exposed_product` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "dbt"."ProductStatus" AS ENUM ('ACTIVE', 'DRAFT', 'ARCHVIVED');

-- AlterTable
ALTER TABLE "dbt"."store_exposed_product" DROP COLUMN "status";