-- CreateTable
CREATE TABLE "public"."help_article_views" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "help_article_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "help_article_views_userId_articleId_key" ON "public"."help_article_views"("userId", "articleId");

-- AddForeignKey
ALTER TABLE "public"."help_article_views" ADD CONSTRAINT "help_article_views_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."help_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
