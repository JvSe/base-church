import { ErrorState } from "@/src/components/common/feedback/error-state";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { Section } from "@/src/components/common/layout/section";
import {
  ArticleCard,
  ArticleFeedback,
  ArticleViewTracker,
  MarkdownViewer,
} from "@/src/components/help";
import { getHelpArticleBySlug } from "@/src/lib/actions";
import { formatRelativeDate } from "@/src/lib/helpers/date-helpers";
import type { HelpArticle } from "@/src/lib/types/help";
import { Button } from "@base-church/ui/components/button";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronRight,
  Eye,
  ThumbsUp,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getArticleData(slug: string) {
  const result = await getHelpArticleBySlug(slug);

  if (!result.success || !result.article) {
    return null;
  }

  return {
    article: result.article as HelpArticle,
    relatedArticles: (result.relatedArticles || []) as HelpArticle[],
  };
}

export default async function HelpArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getArticleData(slug);

  if (!data) {
    return (
      <PageLayout>
        <ErrorState
          icon={BookOpen}
          title="Artigo não encontrado"
          description="Este artigo não existe ou foi removido."
          onRetry={() => {}}
        />
      </PageLayout>
    );
  }

  const { article, relatedArticles } = data;

  return (
    <PageLayout>
      {/* View Tracker - registra visualização automaticamente */}
      <ArticleViewTracker articleId={article.id} />

      {/* Breadcrumb */}
      <div className="mb-6">
        <nav className="dark-text-tertiary mb-4 flex items-center space-x-2 text-sm">
          <Link
            href="/help"
            className="hover:dark-text-primary transition-colors"
          >
            Ajuda
          </Link>
          <ChevronRight size={14} />
          <Link
            href="/help"
            className="hover:dark-text-primary transition-colors"
          >
            {article.category}
          </Link>
          <ChevronRight size={14} />
          <span className="dark-text-secondary">{article.title}</span>
        </nav>

        <Link href="/help">
          <Button
            variant="ghost"
            className="dark-text-secondary hover:dark-text-primary"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Ajuda
          </Button>
        </Link>
      </div>

      {/* Article Header */}
      <div className="dark-card dark-shadow-md mb-6 rounded-xl p-8">
        {/* Category Badge */}
        <div className="mb-4">
          <span className="dark-primary-subtle-bg dark-primary rounded-full px-4 py-2 text-sm font-medium">
            {article.category}
          </span>
        </div>

        {/* Title */}
        <h1 className="dark-text-primary mb-4 text-4xl font-bold">
          {article.title}
        </h1>

        {/* Excerpt */}
        {article.excerpt && (
          <p className="dark-text-secondary mb-6 text-lg leading-relaxed">
            {article.excerpt}
          </p>
        )}

        {/* Meta Info */}
        <div className="dark-border flex flex-wrap items-center gap-6 border-t pt-4">
          <div className="dark-text-tertiary flex items-center space-x-2">
            <Calendar size={16} />
            <span className="text-sm">
              Atualizado {formatRelativeDate(article.updatedAt)}
            </span>
          </div>

          <div className="dark-text-tertiary flex items-center space-x-2">
            <Eye size={16} />
            <span className="text-sm">
              {article.views}{" "}
              {article.views === 1 ? "visualização" : "visualizações"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <ThumbsUp size={16} className="dark-success" />
            <span className="dark-success text-sm font-medium">
              {article.helpful}% acharam útil
              {article._count && article._count.feedbacks > 0 && (
                <span className="dark-text-tertiary ml-1">
                  ({article._count.feedbacks}{" "}
                  {article._count.feedbacks === 1 ? "avaliação" : "avaliações"})
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="dark-card dark-shadow-sm mb-6 rounded-xl p-8">
        <MarkdownViewer content={article.content} />
      </div>

      {/* Feedback Section */}
      <ArticleFeedback articleId={article.id} />

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <Section title="Artigos Relacionados">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle.id} article={relatedArticle} />
            ))}
          </div>
        </Section>
      )}

      {/* Still Need Help Section */}
      <div className="dark-bg-secondary mt-6 rounded-xl p-8 text-center">
        <h3 className="dark-text-primary mb-2 text-lg font-semibold">
          Ainda precisa de ajuda?
        </h3>
        <p className="dark-text-secondary mb-4">
          Entre em contato com nosso suporte
        </p>
        <Link href="/help">
          <Button className="dark-btn-primary">
            <BookOpen className="mr-2 h-4 w-4" />
            Ver opções de suporte
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
}
