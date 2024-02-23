/*
  Warnings:

  - You are about to drop the `Article` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ArticleTags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Article" DROP CONSTRAINT "Article_authorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ArticleTags" DROP CONSTRAINT "ArticleTags_articleId_fkey";

-- DropTable
DROP TABLE "public"."Article";

-- DropTable
DROP TABLE "public"."ArticleTags";
