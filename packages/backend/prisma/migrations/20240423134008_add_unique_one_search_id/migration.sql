/*
  Warnings:

  - A unique constraint covering the columns `[searchId]` on the table `SearchAlert` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SearchAlert_searchId_key" ON "public"."SearchAlert"("searchId");
