"use client";

import {
  ArrowRight,
  BarChart3,
  Briefcase,
  Filter,
  Flame,
  Gift,
  Plus,
  Star,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("TODOS OS LEMBRETES");

  const tabs = [
    "TODOS OS LEMBRETES",
    "EVENTOS",
    "CONTEÚDOS",
    "NOVIDADES DA PLATAFORMA",
    "OFERTAS",
  ];

  const contentCards = [
    {
      id: 1,
      title:
        "Matrículas abertas! Formação em Liderança Ministerial | Base School + FTR",
      dates: "29 - 31 JUL AGO",
      description:
        "As matrículas estão oficialmente abertas com desconto de lançamento. Não perca essa oportunidade única!",
      button: "Garantir minha vaga",
      gradient: "from-purple-600 to-pink-600",
      image: "/api/placeholder/300/200",
      overlay: "Formação em Liderança Ministerial",
      overlayButton: "MATRÍCULAS ABERTAS",
    },
    {
      id: 2,
      title: "Desafio: Sua primeira célula com princípios bíblicos",
      dates: "11 - 14 AGO",
      time: "19:00 - 20:00",
      description:
        "Construa uma célula do zero com princípios bíblicos e coloque em prática em apenas 4 aulas. Domine o discipulado na prática.",
      gradient: "from-purple-600 to-gray-600",
    },
    {
      id: 3,
      title: "English Hub | General English: English Foundations",
      dates: "12 AGO",
      time: "10:00",
      location: "Online, Classroom do Discord",
      description:
        "Recomendado: A1 - B1. Onde: Classroom do Discord EN. If you're just starting your English journey or...",
      tags: ["LÍDERES", "INICIANTE", "MINISTÉRIO"],
      gradient: "from-purple-600 to-gray-600",
    },
    {
      id: 4,
      title: "Café com Pastores: Revisão de Perfis Ministeriais AO VIVO",
      dates: "12 AGO",
      time: "19:00",
      location: "Online, Palco de Líderes - Discord",
      description:
        "O Café com Pastores é um evento online, ao vivo e semanal que acontece às terças-feiras na comunidade...",
      tags: ["LÍDERES"],
      gradient: "from-purple-600 to-gray-600",
    },
  ];

  return (
    <div className="bg-background flex flex-1 gap-6 px-6">
      {/* Left Content */}
      <div className="max-w-4xl flex-1">
        <div className="mb-8">
          <h2 className="text-foreground mb-2 text-2xl font-bold">
            Veja o que vem aí
          </h2>
          <p className="text-muted-foreground">
            Descubra as novidades da Sendo Base
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="text-muted-foreground hover:text-foreground flex items-center space-x-2">
            <Filter size={16} />
            <span className="text-sm">Filtrar por data</span>
          </button>
        </div>

        {/* Content Cards */}
        <div className="space-y-4">
          {contentCards.map((card) => (
            <div
              key={card.id}
              className={`bg-gradient-to-r ${card.gradient} relative overflow-hidden rounded-lg p-6 shadow-lg transition-all duration-300 hover:shadow-2xl`}
            >
              <div className="flex justify-between">
                <div className="flex-1">
                  <div className="flex items-start space-x-4">
                    <div className="text-center">
                      <div className="text-foreground/90 text-sm font-semibold">
                        {card.dates.split(" ").map((part, i) => (
                          <div key={i}>{part}</div>
                        ))}
                      </div>
                      {card.time && (
                        <div className="text-foreground/70 mt-1 text-xs">
                          {card.time}
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-foreground mb-2 text-lg font-semibold">
                        {card.title}
                      </h3>
                      {card.location && (
                        <p className="text-foreground/80 mb-2 text-sm">
                          {card.location}
                        </p>
                      )}
                      <p className="text-foreground/70 mb-4 text-sm">
                        {card.description}
                      </p>

                      {card.tags && (
                        <div className="mb-4 flex space-x-2">
                          {card.tags.map((tag) => (
                            <span
                              key={tag}
                              className="flex items-center space-x-1 rounded-full bg-white/20 px-2 py-1 text-xs text-white"
                            >
                              {tag === "ASSINANTES" && <Star size={12} />}
                              {tag === "INICIANTE" && <BarChart3 size={12} />}
                              {tag === "CARREIRA" && <Briefcase size={12} />}
                              <span>{tag}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      {card.button && (
                        <button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 hover:shadow-secondary/25 flex items-center space-x-2 rounded-lg px-4 py-2 font-semibold shadow-lg transition-all duration-200">
                          <span>{card.button}</span>
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {card.image && (
                  <div className="relative ml-4 h-32 w-48">
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="mb-2 text-lg font-bold text-white">
                          {card.overlay}
                        </div>
                        <button className="rounded bg-purple-600 px-3 py-1 text-sm font-semibold text-white">
                          {card.overlayButton}
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-2 left-2 flex space-x-1">
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-white/20">
                        <Plus size={12} className="text-white" />
                      </div>
                      <div className="flex h-6 w-6 items-center justify-center rounded bg-white/20 text-xs font-bold text-white">
                        SB
                      </div>
                    </div>
                  </div>
                )}

                {!card.image && (
                  <ArrowRight size={20} className="text-foreground/70" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="bg-dark-1/30 border-dark-1 w-80 space-y-6 rounded-lg p-6 shadow-lg backdrop-blur-sm">
        {/* User Profile */}
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <span className="text-lg font-semibold text-white">JS</span>
          </div>
          <h3 className="text-foreground font-semibold">
            Joao Vitor Soares Egidio Nunes
          </h3>
        </div>

        {/* My Objective */}
        <div className="bg-dark-2/50 border-dark-1 rounded-lg border p-4">
          <div className="mb-3 flex items-center space-x-3">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded">
              <Target size={16} className="text-primary-foreground" />
            </div>
            <h4 className="text-foreground font-semibold">Meu objetivo</h4>
          </div>
          <p className="text-muted-foreground mb-3 text-sm">
            Crie um plano personalizado para te levar ao seu objetivo.
          </p>
          <button className="text-primary hover:text-primary/80 flex items-center space-x-1 text-sm">
            <span>Definir objetivo</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* My Boosts */}
        <div className="bg-dark-2/50 border-dark-1 rounded-lg border p-4">
          <div className="mb-3 flex items-center space-x-3">
            <Flame className="text-secondary" size={20} />
            <h4 className="text-foreground font-semibold">Meus boosts</h4>
          </div>
          <p className="text-muted-foreground mb-3 text-sm">
            Defina uma meta e acompanhe o seu progresso semanal
          </p>
          <button className="text-primary hover:text-primary/80 flex items-center space-x-1 text-sm">
            <span>Definir minha meta</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-primary/25 flex w-full items-center justify-center space-x-2 rounded-lg py-3 font-semibold shadow-lg transition-all duration-200">
            <Gift size={16} />
            <span>Indique e ganhe</span>
          </button>
          <button className="bg-dark-2 text-foreground hover:bg-dark-2/70 border-dark-1 flex w-full items-center justify-center space-x-2 rounded-lg border py-3 font-semibold transition-all duration-200">
            <Users size={16} />
            <span>Comunidade</span>
          </button>
        </div>

        {/* Advertisement Card */}
        <div className="from-primary to-primary-2 relative overflow-hidden rounded-lg bg-gradient-to-br p-4">
          <div className="mb-4 flex items-start justify-between">
            <h4 className="text-primary-foreground text-lg font-bold">
              SENDO BASE
            </h4>
            <span className="bg-primary-foreground/20 text-primary-foreground rounded-full px-2 py-1 text-xs">
              Material Gratuito
            </span>
          </div>

          <div className="text-primary-foreground mb-4 text-2xl font-bold">
            DEV STARTER PACK
          </div>

          <div className="relative mb-4 h-32">
            <div className="from-primary-foreground/10 absolute inset-0 rounded-lg bg-gradient-to-br to-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-primary-foreground/80 text-center">
                <div className="mb-2 text-4xl">💻</div>
                <div className="text-sm">Monitores, código e gráficos</div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button className="text-primary-foreground/70 hover:text-primary-foreground">
              <ArrowRight size={16} className="rotate-180" />
            </button>
            <button className="text-primary-foreground/70 hover:text-primary-foreground">
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
