-- CreateTable
CREATE TABLE "public"."Article" (
    "id" TEXT NOT NULL DEFAULT (gen_random_uuid())::text,
    "handle" TEXT NOT NULL,
    "htmlContent" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "blurb" TEXT,
    "authorId" UUID,
    "imageSrc" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ArticleTags" (
    "articleId" TEXT NOT NULL,
    "tag" TEXT NOT NULL,

    CONSTRAINT "ArticleTags_pkey" PRIMARY KEY ("articleId","tag")
);

-- AddForeignKey
ALTER TABLE "public"."Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "public"."Customer"("authUserId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ArticleTags" ADD CONSTRAINT "ArticleTags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
