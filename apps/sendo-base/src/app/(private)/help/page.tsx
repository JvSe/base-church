"use client";

import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { Section } from "@/src/components/common/layout/section";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import {
  BookOpen,
  ChevronRight,
  Clock,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search,
  Star,
  ThumbsUp,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";

export default function AjudaPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const faqCategories = [
    {
      title: "Primeiros Passos",
      icon: BookOpen,
      color: "dark-primary",
      bgColor: "dark-primary-subtle-bg",
      questions: [
        "Como criar minha conta?",
        "Como navegar pela plataforma?",
        "Onde encontro meus cursos?",
        "Como atualizar meu perfil?",
      ],
    },
    {
      title: "Cursos e Aulas",
      icon: Video,
      color: "dark-secondary",
      bgColor: "dark-secondary-subtle-bg",
      questions: [
        "Como assistir às aulas?",
        "Posso baixar o conteúdo?",
        "Como acompanhar meu progresso?",
        "Como obter certificados?",
      ],
    },
    {
      title: "Pagamentos",
      icon: HelpCircle,
      color: "dark-info",
      bgColor: "dark-info-bg",
      questions: [
        "Quais formas de pagamento aceitas?",
        "Como cancelar minha assinatura?",
        "Posso ter reembolso?",
        "Como atualizar dados de cobrança?",
      ],
    },
    {
      title: "Técnico",
      icon: Users,
      color: "dark-warning",
      bgColor: "dark-warning-bg",
      questions: [
        "Problemas de reprodução?",
        "App não carrega?",
        "Erro de login?",
        "Problemas de áudio/vídeo?",
      ],
    },
  ];

  const supportOptions = [
    {
      title: "Chat ao Vivo",
      description: "Converse com nosso time de suporte",
      icon: MessageCircle,
      action: "Iniciar Chat",
      available: true,
      responseTime: "Resposta em ~2 min",
    },
    {
      title: "Email",
      description: "Envie sua dúvida por email",
      icon: Mail,
      action: "Enviar Email",
      available: true,
      responseTime: "Resposta em ~2 horas",
    },
    {
      title: "Telefone",
      description: "Ligue para nosso suporte",
      icon: Phone,
      action: "(11) 9999-9999",
      available: false,
      responseTime: "Seg-Sex: 9h às 18h",
    },
  ];

  const popularArticles = [
    {
      title: "Como baixar certificados de conclusão",
      category: "Certificados",
      views: "2.1k visualizações",
      helpful: 95,
    },
    {
      title: "Configurar notificações de aulas",
      category: "Configurações",
      views: "1.8k visualizações",
      helpful: 92,
    },
    {
      title: "Acessar cursos offline no aplicativo",
      category: "Mobile",
      views: "1.5k visualizações",
      helpful: 89,
    },
    {
      title: "Recuperar senha perdida",
      category: "Conta",
      views: "1.2k visualizações",
      helpful: 94,
    },
  ];

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
        {/* Search Bar */}
        <div className="relative mx-auto max-w-md">
          <Search
            className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
            size={20}
          />
          <Input
            className="dark-input h-14 pl-12 text-lg"
            placeholder="Buscar ajuda..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* FAQ Categories */}
      <Section title="Categorias de Ajuda">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {faqCategories.map((category, index) => (
            <div
              key={index}
              className="dark-card dark-shadow-sm group cursor-pointer rounded-xl p-6"
            >
              <div className={`${category.bgColor} mb-4 w-fit rounded-xl p-4`}>
                <category.icon className={category.color} size={32} />
              </div>
              <h3 className="dark-text-primary mb-3 text-lg font-semibold">
                {category.title}
              </h3>
              <ul className="space-y-2">
                {category.questions.map((question, qIndex) => (
                  <li
                    key={qIndex}
                    className="dark-text-secondary hover:dark-text-primary flex cursor-pointer items-center gap-2 text-sm transition-colors"
                  >
                    <ChevronRight size={14} />
                    {question}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* Popular Articles */}
      <Section title="Artigos Populares">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {popularArticles.map((article, index) => (
            <div
              key={index}
              className="dark-bg-secondary hover:dark-bg-tertiary group cursor-pointer rounded-xl p-6 transition-all"
            >
              <div className="mb-3 flex items-start justify-between">
                <span className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-xs font-medium">
                  {article.category}
                </span>
                <div className="flex items-center gap-1">
                  <ThumbsUp size={14} className="dark-success" />
                  <span className="dark-success text-sm font-medium">
                    {article.helpful}%
                  </span>
                </div>
              </div>
              <h3 className="dark-text-primary group-hover:dark-primary mb-2 font-semibold transition-colors">
                {article.title}
              </h3>
              <p className="dark-text-tertiary text-sm">{article.views}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Support Options */}
      <Section title="Precisa de mais ajuda?">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {supportOptions.map((option, index) => (
            <div
              key={index}
              className={`dark-card dark-shadow-sm rounded-xl p-6 text-center ${!option.available && "opacity-60"}`}
            >
              <div className="dark-primary-subtle-bg mx-auto mb-4 w-fit rounded-full p-4">
                <option.icon className="dark-primary" size={32} />
              </div>
              <h3 className="dark-text-primary mb-2 text-lg font-semibold">
                {option.title}
              </h3>
              <p className="dark-text-secondary mb-4">{option.description}</p>
              <div className="mb-4 flex items-center justify-center gap-1">
                <Clock size={14} className="dark-text-tertiary" />
                <span className="dark-text-tertiary text-sm">
                  {option.responseTime}
                </span>
              </div>
              <Button
                className={
                  option.available
                    ? "dark-btn-primary w-full"
                    : "dark-text-disabled w-full cursor-not-allowed"
                }
                disabled={!option.available}
              >
                {option.action}
              </Button>
            </div>
          ))}
        </div>
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
