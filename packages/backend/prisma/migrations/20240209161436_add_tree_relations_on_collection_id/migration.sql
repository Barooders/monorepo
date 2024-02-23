-- AlterTable
ALTER TABLE "public"."Collection" ADD COLUMN     "parentId" TEXT;

-- AddForeignKey
ALTER TABLE "public"."Collection" ADD CONSTRAINT "Collection_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;
