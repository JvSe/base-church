-- CreateTable
CREATE TABLE "public"."help_categories" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "bgColor" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."help_questions" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "views" INTEGER NOT NULL DEFAULT 0,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "notHelpful" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."help_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "excerpt" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "helpful" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "help_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."support_options" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "contactInfo" TEXT,
    "responseTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "support_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "help_articles_slug_key" ON "public"."help_articles"("slug");

-- AddForeignKey
ALTER TABLE "public"."help_questions" ADD CONSTRAINT "help_questions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."help_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
