/*
  Warnings:

  - Made the column `type` on table `lessons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."forum_posts" ADD COLUMN     "likesCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "viewsCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."lessons" ALTER COLUMN "type" SET NOT NULL;

-- CreateTable
CREATE TABLE "public"."forum_post_likes" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_post_likes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."forum_post_views" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "forum_post_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "forum_post_likes_userId_postId_key" ON "public"."forum_post_likes"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "forum_post_views_userId_postId_key" ON "public"."forum_post_views"("userId", "postId");

-- AddForeignKey
ALTER TABLE "public"."forum_post_likes" ADD CONSTRAINT "forum_post_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forum_post_likes" ADD CONSTRAINT "forum_post_likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forum_post_views" ADD CONSTRAINT "forum_post_views_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."forum_post_views" ADD CONSTRAINT "forum_post_views_postId_fkey" FOREIGN KEY ("postId") REFERENCES "public"."forum_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
