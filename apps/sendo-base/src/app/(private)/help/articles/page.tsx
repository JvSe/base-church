import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import {
  ArticleCard,
  ArticlesFilter,
  ArticlesSearch,
} from "@/src/components/help";
import { getHelpArticles } from "@/src/lib/actions";
import type { CategoryWithCount, HelpArticle } from "@/src/lib/types/help";
import { Button } from "@base-church/ui/components/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

async function getArticlesData(filters?: {
  search?: string;
  category?: string;
}) {
  const result = await getHelpArticles(filters);

  if (!result.success) {
    throw new Error(result.error);
  }

  return {
    articles: result.articles as HelpArticle[],
    categoriesWithCount: result.categoriesWithCount as CategoryWithCount[],
  };
}

export default async function HelpArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { articles, categoriesWithCount } = await getArticlesData({
    search: params.search,
    category: params.category,
  });

  const currentCategory = params.category || "all";
  const searchQuery = params.search || "";

  // Build page title based on filters
  let pageTitle = "Todos os Artigos";
  if (searchQuery) {
    pageTitle = `Resultados para "${searchQuery}"`;
  } else if (currentCategory !== "all") {
    pageTitle = `Artigos de ${currentCategory}`;
  }

  return (
    <PageLayout>
      {/* Back to Help */}
      <div className="mb-4">
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

      <PageHeader
        title={pageTitle}
        description={
          searchQuery
            ? `${articles.length} ${articles.length === 1 ? "artigo encontrado" : "artigos encontrados"}`
            : "Explore nossa base de conhecimento completa"
        }
      >
        <div className="mt-6">
          <ArticlesSearch />
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <ArticlesFilter
            categoriesWithCount={categoriesWithCount}
            currentCategory={currentCategory}
          />
        </div>

        {/* Articles list */}
        <div className="lg:col-span-3">
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="dark-card rounded-xl p-12 text-center">
              <div className="dark-primary-subtle-bg mx-auto mb-4 w-fit rounded-full p-6">
                <BookOpen className="dark-primary" size={48} />
              </div>
              <h3 className="dark-text-primary mb-2 text-xl font-semibold">
                {searchQuery
                  ? "Nenhum artigo encontrado"
                  : "Nenhum artigo disponível"}
              </h3>
              <p className="dark-text-secondary mb-6">
                {searchQuery
                  ? "Tente ajustar sua busca ou explorar outras categorias"
                  : "Não há artigos nesta categoria no momento"}
              </p>
              {(searchQuery || currentCategory !== "all") && (
                <Link href="/help/articles">
                  <Button className="dark-btn-primary">
                    Ver todos os artigos
                  </Button>
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
