-- CreateTable
CREATE TABLE "public"."help_article_feedbacks" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isHelpful" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "help_article_feedbacks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "help_article_feedbacks_userId_articleId_key" ON "public"."help_article_feedbacks"("userId", "articleId");

-- AddForeignKey
ALTER TABLE "public"."help_article_feedbacks" ADD CONSTRAINT "help_article_feedbacks_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "public"."help_articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
