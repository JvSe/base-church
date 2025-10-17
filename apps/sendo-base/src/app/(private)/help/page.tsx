import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { Section } from "@/src/components/common/layout/section";
import {
  ArticleCard,
  CategoryCard,
  HelpSearch,
  SupportOptionCard,
} from "@/src/components/help";
import {
  getFeaturedHelpArticles,
  getHelpCategories,
  getSupportOptions,
} from "@/src/lib/actions";
import type {
  HelpArticle,
  HelpCategoryWithQuestions,
  SupportOption,
} from "@/src/lib/types/help";
import { Button } from "@base-church/ui/components/button";
import {
  ArrowRight,
  HelpCircle,
  MessageCircle,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getHelpData() {
  const [categoriesResult, articlesResult, supportResult] = await Promise.all([
    getHelpCategories(),
    getFeaturedHelpArticles(),
    getSupportOptions(),
  ]);

  return {
    categories: (categoriesResult.success
      ? categoriesResult.categories
      : []) as HelpCategoryWithQuestions[],
    articles: (articlesResult.success
      ? articlesResult.articles
      : []) as HelpArticle[],
    supportOptions: (supportResult.success
      ? supportResult.options
      : []) as SupportOption[],
  };
}

export default async function HelpPage() {
  const { categories, articles, supportOptions } = await getHelpData();

  return (
    <PageLayout spacing="relaxed">
      <PageHeader
        title={
          <div className="text-center">
            <div className="dark-primary-subtle-bg mx-auto mb-6 w-fit rounded-full p-4">
              <HelpCircle className="dark-primary" size={48} />
            </div>
            <h1 className="dark-text-primary mb-4 text-4xl font-bold">
              Como podemos ajudar?
            </h1>
          </div>
        }
        description={
          <p className="dark-text-secondary mx-auto mb-8 max-w-2xl text-center text-lg">
            Encontre respostas para suas dúvidas ou entre em contato conosco
          </p>
        }
      >
        <HelpSearch />
      </PageHeader>

      {/* FAQ Categories */}
      <Section title="Categorias de Ajuda">
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <div className="dark-card rounded-xl p-8 text-center">
            <p className="dark-text-secondary">
              Nenhuma categoria de ajuda disponível no momento.
            </p>
          </div>
        )}
      </Section>

      {/* Popular Articles */}
      <Section
        title="Artigos Populares"
        right={
          <Link href="/help/articles">
            <Button
              variant="ghost"
              className="dark-text-secondary hover:dark-text-primary"
            >
              Ver todos os artigos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        }
      >
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="dark-card rounded-xl p-8 text-center">
            <p className="dark-text-secondary">
              Nenhum artigo disponível no momento.
            </p>
          </div>
        )}
      </Section>

      {/* Support Options */}
      <Section title="Precisa de mais ajuda?">
        {supportOptions.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {supportOptions.map((option) => (
              <SupportOptionCard key={option.id} option={option} />
            ))}
          </div>
        ) : (
          <div className="dark-card rounded-xl p-8 text-center">
            <p className="dark-text-secondary">
              Nenhuma opção de suporte disponível no momento.
            </p>
          </div>
        )}
      </Section>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
          <div className="dark-success-bg mx-auto mb-4 w-fit rounded-full p-4">
            <Star className="dark-success" size={32} />
          </div>
          <h3 className="dark-text-primary mb-2 text-2xl font-bold">4.9/5</h3>
          <p className="dark-text-secondary">Satisfação do suporte</p>
        </div>

        <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
          <div className="dark-info-bg mx-auto mb-4 w-fit rounded-full p-4">
            <MessageCircle className="dark-info" size={32} />
          </div>
          <h3 className="dark-text-primary mb-2 text-2xl font-bold">
            &lt; 2min
          </h3>
          <p className="dark-text-secondary">Tempo médio de resposta</p>
        </div>

        <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
          <div className="dark-warning-bg mx-auto mb-4 w-fit rounded-full p-4">
            <Users className="dark-warning" size={32} />
          </div>
          <h3 className="dark-text-primary mb-2 text-2xl font-bold">24/7</h3>
          <p className="dark-text-secondary">Suporte disponível</p>
        </div>
      </div>
    </PageLayout>
  );
}
