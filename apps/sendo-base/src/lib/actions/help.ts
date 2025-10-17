"use server";

import { prisma } from "@base-church/db";
import { revalidatePath } from "next/cache";

// Get all help categories with their questions
export async function getHelpCategories() {
  try {
    const categories = await prisma.helpCategory.findMany({
      where: { isActive: true },
      include: {
        questions: {
          where: { isActive: true },
          orderBy: { order: "asc" },
          take: 4, // Limit to 4 questions per category for the main page
        },
      },
      orderBy: { order: "asc" },
    });

    return { success: true, categories };
  } catch (error) {
    console.error("Get help categories error:", error);
    return { success: false, error: "Failed to fetch help categories" };
  }
}

// Get featured/popular help articles
export async function getFeaturedHelpArticles() {
  try {
    const articles = await prisma.helpArticle.findMany({
      where: {
        isPublished: true,
        isFeatured: true,
      },
      orderBy: { views: "desc" },
      take: 4,
    });

    return { success: true, articles };
  } catch (error) {
    console.error("Get featured articles error:", error);
    return { success: false, error: "Failed to fetch featured articles" };
  }
}

// Get all help articles with optional filters
export async function getHelpArticles(filters?: {
  search?: string;
  category?: string;
}) {
  try {
    const whereClause: any = {
      isPublished: true,
    };

    // Apply search filter
    if (filters?.search && filters.search.trim()) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { content: { contains: filters.search, mode: "insensitive" } },
        { excerpt: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    // Apply category filter
    if (filters?.category && filters.category !== "all") {
      whereClause.category = filters.category;
    }

    const articles = await prisma.helpArticle.findMany({
      where: whereClause,
      orderBy: [{ isFeatured: "desc" }, { views: "desc" }, { helpful: "desc" }],
    });

    // Get unique categories with counts
    const allArticles = await prisma.helpArticle.findMany({
      where: { isPublished: true },
      select: { category: true },
    });

    // Count articles per category
    const categoryCount = allArticles.reduce(
      (acc, article) => {
        acc[article.category] = (acc[article.category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const categoriesWithCount = Object.entries(categoryCount).map(
      ([name, count]) => ({ name, count }),
    );

    return { success: true, articles, categoriesWithCount };
  } catch (error) {
    console.error("Get help articles error:", error);
    return { success: false, error: "Failed to fetch help articles" };
  }
}

// Get support options
export async function getSupportOptions() {
  try {
    const options = await prisma.supportOption.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return { success: true, options };
  } catch (error) {
    console.error("Get support options error:", error);
    return { success: false, error: "Failed to fetch support options" };
  }
}

// Search help content
export async function searchHelp(query: string) {
  try {
    if (!query || query.trim().length < 2) {
      return { success: true, results: [] };
    }

    const searchTerm = query.trim();

    // Search in questions
    const questions = await prisma.helpQuestion.findMany({
      where: {
        isActive: true,
        OR: [
          { question: { contains: searchTerm, mode: "insensitive" } },
          { answer: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      include: {
        category: {
          select: {
            title: true,
            color: true,
          },
        },
      },
      take: 10,
    });

    // Search in articles
    const articles = await prisma.helpArticle.findMany({
      where: {
        isPublished: true,
        OR: [
          { title: { contains: searchTerm, mode: "insensitive" } },
          { content: { contains: searchTerm, mode: "insensitive" } },
          { excerpt: { contains: searchTerm, mode: "insensitive" } },
        ],
      },
      take: 10,
    });

    return {
      success: true,
      results: {
        questions,
        articles,
      },
    };
  } catch (error) {
    console.error("Search help error:", error);
    return { success: false, error: "Failed to search help content" };
  }
}

// Get article by slug
export async function getHelpArticleBySlug(slug: string) {
  try {
    const article = await prisma.helpArticle.findUnique({
      where: { slug, isPublished: true },
      include: {
        _count: {
          select: {
            feedbacks: true,
          },
        },
      },
    });

    if (!article) {
      return { success: false, error: "Article not found" };
    }

    // Get related articles from the same category
    const relatedArticles = await prisma.helpArticle.findMany({
      where: {
        isPublished: true,
        category: article.category,
        NOT: { id: article.id },
      },
      take: 3,
      orderBy: { views: "desc" },
    });

    return { success: true, article, relatedArticles };
  } catch (error) {
    console.error("Get article by slug error:", error);
    return { success: false, error: "Failed to fetch article" };
  }
}

// Register article view (unique per user)
export async function registerArticleView(articleId: string, userId: string) {
  try {
    // Check if user already viewed this article
    const existingView = await prisma.helpArticleView.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    // Only register if it's a new view
    if (!existingView) {
      await prisma.$transaction([
        prisma.helpArticleView.create({
          data: {
            userId,
            articleId,
          },
        }),
        prisma.helpArticle.update({
          where: { id: articleId },
          data: { views: { increment: 1 } },
        }),
      ]);
    }

    return { success: true };
  } catch (error) {
    console.error("Register article view error:", error);
    // Não retornar erro para não quebrar a página
    return { success: false, error: "Failed to register view" };
  }
}

// Increment article views
export async function incrementArticleViews(articleId: string) {
  try {
    await prisma.helpArticle.update({
      where: { id: articleId },
      data: { views: { increment: 1 } },
    });

    return { success: true };
  } catch (error) {
    console.error("Increment article views error:", error);
    return { success: false, error: "Failed to increment views" };
  }
}

// Mark article as helpful
export async function markArticleAsHelpful(
  articleId: string,
  userId: string,
  isHelpful: boolean,
) {
  try {
    // Check if user already gave feedback
    const existingFeedback = await prisma.helpArticleFeedback.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    if (existingFeedback) {
      return {
        success: false,
        error: "Você já avaliou este artigo",
      };
    }

    // Create feedback
    await prisma.helpArticleFeedback.create({
      data: {
        articleId,
        userId,
        isHelpful,
      },
    });

    // Recalculate helpful percentage
    const allFeedbacks = await prisma.helpArticleFeedback.findMany({
      where: { articleId },
    });

    const helpfulCount = allFeedbacks.filter((f) => f.isHelpful).length;
    const totalCount = allFeedbacks.length;
    const helpfulPercentage =
      totalCount > 0 ? Math.round((helpfulCount / totalCount) * 100) : 0;

    // Update article
    await prisma.helpArticle.update({
      where: { id: articleId },
      data: { helpful: helpfulPercentage },
    });

    revalidatePath("/help");
    revalidatePath(`/help/article`);
    return { success: true, helpfulPercentage };
  } catch (error) {
    console.error("Mark article as helpful error:", error);
    return { success: false, error: "Failed to mark as helpful" };
  }
}

// Check if user already gave feedback to article
export async function checkArticleFeedback(articleId: string, userId: string) {
  try {
    const feedback = await prisma.helpArticleFeedback.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });

    return {
      success: true,
      hasVoted: !!feedback,
      vote: feedback?.isHelpful,
    };
  } catch (error) {
    return { success: false, hasVoted: false };
  }
}
