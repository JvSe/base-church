"use client";

import { Button } from "@repo/ui/components/button";
import {
  Activity,
  Award,
  Bell,
  BookOpen,
  Calendar,
  Clock,
  Flame,
  Gift,
  PlayCircle,
  Plus,
  Star,
  Target,
  TrendingUp,
  User,
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
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Bom dia, João! 👋
              </h1>
              <p className="dark-text-secondary">
                Continue sua jornada de aprendizado
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                className="dark-glass dark-border hover:dark-border-hover"
                size="icon-lg"
              >
                <Bell className="dark-text-primary" size={20} />
              </Button>
              <Button className="dark-btn-primary gap-2">
                <Plus size={18} />
                Novo Curso
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Cursos Ativos
                </p>
                <p className="dark-text-primary text-2xl font-bold">5</p>
              </div>
              <div className="dark-primary-subtle-bg rounded-xl p-3">
                <BookOpen className="dark-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">+2 este mês</span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Horas Estudadas
                </p>
                <p className="dark-text-primary text-2xl font-bold">24.5h</p>
              </div>
              <div className="dark-secondary-subtle-bg rounded-xl p-3">
                <Clock className="dark-secondary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Activity className="dark-secondary mr-1" size={16} />
              <span className="dark-secondary font-medium">Esta semana</span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Certificados
                </p>
                <p className="dark-text-primary text-2xl font-bold">3</p>
              </div>
              <div className="dark-warning-bg rounded-xl p-3">
                <Award className="dark-warning" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="dark-warning mr-1" size={16} />
              <span className="dark-warning font-medium">98% aprovação</span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Sequência
                </p>
                <p className="dark-text-primary text-2xl font-bold">12 dias</p>
              </div>
              <div className="dark-success-bg rounded-xl p-3">
                <Flame className="dark-success" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Target className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">Meta: 30 dias</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Continue Learning */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                  <PlayCircle className="dark-primary" size={24} />
                  Continue Aprendendo
                </h2>
                <Button className="dark-glass dark-border hover:dark-border-hover text-sm">
                  Ver Todos
                </Button>
              </div>
              <p className="dark-text-secondary mb-6">
                Retome seus cursos onde parou
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: "Formação em Liderança Ministerial",
                    progress: 65,
                    nextLesson: "Princípios de Comunicação",
                    timeLeft: "2h 30min",
                    instructor: "Pr. Robson",
                  },
                  {
                    title: "Discipulado Bíblico Prático",
                    progress: 40,
                    nextLesson: "Estruturando uma Célula",
                    timeLeft: "1h 45min",
                    instructor: "Pr. João",
                  },
                ].map((course, index) => (
                  <div
                    key={index}
                    className="dark-card dark-shadow-sm group cursor-pointer rounded-xl p-4 transition-all hover:shadow-md"
                  >
                    <div className="mb-4 flex items-start gap-4">
                      <div className="dark-bg-tertiary flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg">
                        <BookOpen className="dark-text-tertiary" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="dark-text-primary group-hover:dark-primary mb-1 font-semibold transition-colors">
                          {course.title}
                        </h3>
                        <p className="dark-text-secondary mb-1 text-sm">
                          Próxima: {course.nextLesson}
                        </p>
                        <p className="dark-text-tertiary text-xs">
                          Instrutor: {course.instructor}
                        </p>
                      </div>
                      <Button className="dark-btn-primary">
                        <PlayCircle className="mr-1" size={14} />
                        Continuar
                      </Button>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="dark-text-secondary font-medium">
                          Progresso
                        </span>
                        <span className="dark-primary font-semibold">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="dark-bg-tertiary h-2 w-full rounded-full">
                        <div
                          className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="dark-text-tertiary text-xs">
                          {course.timeLeft} restantes
                        </p>
                        <div className="flex items-center gap-1">
                          <Clock className="dark-text-tertiary" size={12} />
                          <span className="dark-text-tertiary text-xs">
                            Última aula: 2 dias atrás
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                  <Calendar className="dark-secondary" size={24} />
                  Próximos Eventos
                </h2>
                <Button className="dark-glass dark-border hover:dark-border-hover text-sm">
                  Ver Agenda
                </Button>
              </div>
              <p className="dark-text-secondary mb-6">
                Não perca essas oportunidades ministeriais
              </p>

              <div className="space-y-4">
                {contentCards.slice(0, 2).map((event, index) => (
                  <div
                    key={index}
                    className="dark-card dark-shadow-sm group cursor-pointer rounded-xl p-4 transition-all hover:shadow-md"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex gap-3">
                        <div className="dark-primary-subtle-bg min-w-[60px] rounded-lg p-2 text-center">
                          <div className="dark-primary text-sm font-bold">
                            {event.dates.split(" ")[0]}
                          </div>
                          <div className="dark-primary text-xs">
                            {event.dates.split(" ")[1] || "AGO"}
                          </div>
                        </div>
                        <div className="dark-bg-tertiary flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg">
                          <Calendar className="dark-text-tertiary" size={24} />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="dark-text-primary group-hover:dark-primary mb-2 font-semibold transition-colors">
                          {event.title}
                        </h3>
                        <p className="dark-text-secondary mb-3 line-clamp-2 text-sm">
                          {event.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {event.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium"
                              >
                                {tag}
                              </span>
                            ))}
                            {event.time && (
                              <span className="dark-warning-bg dark-warning rounded-full px-2 py-1 text-xs font-medium">
                                {event.time}
                              </span>
                            )}
                          </div>
                          <Button className="dark-gradient-secondary">
                            Inscrever-se
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6 text-center">
              <div className="dark-primary-subtle-bg mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <User className="dark-primary" size={28} />
              </div>
              <h3 className="dark-text-primary mb-1 font-semibold">
                João Vitor Soares
              </h3>
              <p className="dark-text-secondary mb-4 text-sm">
                Líder em Formação
              </p>
              <div className="mb-4 flex items-center justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="dark-text-primary text-lg font-bold">
                    Nível 5
                  </div>
                  <div className="dark-text-tertiary text-xs">Avançado</div>
                </div>
                <div className="dark-border h-8 w-px" />
                <div className="text-center">
                  <div className="dark-text-primary text-lg font-bold">
                    1,250
                  </div>
                  <div className="dark-text-tertiary text-xs">XP Total</div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="dark-text-tertiary">Próximo nível</span>
                  <span className="dark-primary font-medium">250/500 XP</span>
                </div>
                <div className="dark-bg-tertiary h-2 w-full rounded-full">
                  <div className="dark-gradient-primary h-2 w-[50%] rounded-full transition-all duration-300" />
                </div>
              </div>
            </div>

            {/* Goals */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
                <Target className="dark-warning" size={20} />
                Metas da Semana
              </h3>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="dark-text-secondary text-sm font-medium">
                      Estudar 5h/semana
                    </span>
                    <span className="dark-primary text-sm font-semibold">
                      4.2/5h
                    </span>
                  </div>
                  <div className="dark-bg-tertiary h-2 w-full rounded-full">
                    <div className="dark-gradient-secondary h-2 w-[84%] rounded-full transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="dark-success" size={12} />
                    <span className="dark-success text-xs font-medium">
                      Quase lá! Faltam 48min
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="dark-text-secondary text-sm font-medium">
                      Concluir 2 cursos
                    </span>
                    <span className="dark-primary text-sm font-semibold">
                      1/2
                    </span>
                  </div>
                  <div className="dark-bg-tertiary h-2 w-full rounded-full">
                    <div className="dark-gradient-primary h-2 w-[50%] rounded-full transition-all duration-300" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="dark-warning" size={12} />
                    <span className="dark-warning text-xs font-medium">
                      1 curso restante
                    </span>
                  </div>
                </div>

                <Button className="dark-glass dark-border hover:dark-border-hover w-full text-sm">
                  <Plus className="mr-1" size={14} />
                  Definir Nova Meta
                </Button>
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
                <Award className="dark-secondary" size={20} />
                Conquistas Recentes
              </h3>

              <div className="space-y-3">
                {[
                  {
                    icon: "🔥",
                    title: "Sequência de 12 dias",
                    desc: "Manteve o foco!",
                    earned: true,
                  },
                  {
                    icon: "📚",
                    title: "5 Cursos Ativos",
                    desc: "Sede de conhecimento",
                    earned: true,
                  },
                  {
                    icon: "⭐",
                    title: "Avaliação 5 estrelas",
                    desc: "Próxima conquista",
                    earned: false,
                  },
                ].map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center space-x-3 ${!achievement.earned ? "opacity-50" : ""}`}
                  >
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="dark-text-primary text-sm font-medium">
                        {achievement.title}
                      </div>
                      <div className="dark-text-tertiary text-xs">
                        {achievement.desc}
                      </div>
                    </div>
                    {achievement.earned && (
                      <div className="dark-success-bg h-2 w-2 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Ações Rápidas
              </h3>

              <div className="space-y-3">
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start gap-3">
                  <Gift className="dark-primary" size={16} />
                  <span className="dark-text-primary">Indique e Ganhe</span>
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start gap-3">
                  <Users className="dark-secondary" size={16} />
                  <span className="dark-text-primary">Comunidade</span>
                </Button>
                <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start gap-3">
                  <Award className="dark-warning" size={16} />
                  <span className="dark-text-primary">Meus Certificados</span>
                </Button>
                <Button className="dark-btn-primary w-full justify-start gap-3">
                  <Plus size={16} />
                  <span>Explorar Cursos</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
            <Activity className="dark-info" size={24} />
            Atividade Recente
          </h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                type: "course_completed",
                title: "Curso Concluído",
                description: "Fundamentos Ministeriais",
                time: "2 horas atrás",
                icon: BookOpen,
                color: "dark-success",
                bgColor: "dark-success-bg",
              },
              {
                type: "achievement",
                title: "Nova Conquista",
                description: "Sequência de 12 dias",
                time: "1 dia atrás",
                icon: Award,
                color: "dark-warning",
                bgColor: "dark-warning-bg",
              },
              {
                type: "event_joined",
                title: "Evento Inscrito",
                description: "Café com Pastores",
                time: "3 dias atrás",
                icon: Calendar,
                color: "dark-primary",
                bgColor: "dark-primary-subtle-bg",
              },
              {
                type: "community",
                title: "Post na Comunidade",
                description: "Compartilhou experiência",
                time: "5 dias atrás",
                icon: Users,
                color: "dark-secondary",
                bgColor: "dark-secondary-subtle-bg",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="dark-card dark-shadow-sm rounded-xl p-4"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className={`${activity.bgColor} rounded-lg p-2`}>
                    <activity.icon className={activity.color} size={16} />
                  </div>
                  <div className="flex-1">
                    <h3 className="dark-text-primary text-sm font-medium">
                      {activity.title}
                    </h3>
                    <p className="dark-text-tertiary text-xs">
                      {activity.time}
                    </p>
                  </div>
                </div>
                <p className="dark-text-secondary text-sm">
                  {activity.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
