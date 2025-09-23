"use client";

import { useAuth } from "@/src/hooks";
import { getEvents, getUserProfile } from "@/src/lib/actions";
import { Button } from "@repo/ui/components/button";
import { useQuery } from "@tanstack/react-query";
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
import Link from "next/link";
import { useState } from "react";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("TODOS OS LEMBRETES");

  // Hook de usuário
  const { user, isAuthenticated, isLoading: userLoading } = useAuth();

  // Fetch user data - usar ID do usuário logado se disponível
  const { data: userData } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () =>
      user?.id
        ? getUserProfile(user.id)
        : Promise.resolve({ success: true, user: null }),
    select: (data: any) => data?.user,
    enabled: !!user?.id, // Só executar se tiver user.id
  });

  // Fetch events
  const { data: eventsData } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
    select: (data) => data.events,
  });

  // Helper functions
  const formatDate = (date: Date) => {
    return date
      .toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "short",
      })
      .toUpperCase();
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Calculate user stats
  const activeCourses =
    (userData as any)?.enrollments?.filter(
      (e: any) => e.isActive && !e.completedAt,
    )?.length || 0;
  const completedCourses =
    (userData as any)?.enrollments?.filter((e: any) => e.completedAt)?.length ||
    0;
  const certificates = (userData as any)?.certificates?.length || 0;
  const currentStreak = (userData as any)?.currentStreak || 0;
  const totalPoints = (userData as any)?.totalPoints || 0;
  const level = (userData as any)?.level || 1;
  const experience = (userData as any)?.experience || 0;

  // Get upcoming events (next 7 days)
  const upcomingEvents =
    eventsData
      ?.filter((event) => {
        const eventDate = new Date(event.startDate);
        const now = new Date();
        const diffTime = eventDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays <= 7;
      })
      .slice(0, 3) || [];

  // Get active enrollments for continue learning
  const activeEnrollments =
    (userData as any)?.enrollments
      ?.filter(
        (e: any) => e.isActive && !e.completedAt && (e.progress || 0) > 0,
      )
      .slice(0, 2) || [];

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
                {getGreeting()},{" "}
                {user?.name?.split(" ")[0] ||
                  userData?.name?.split(" ")[0] ||
                  "Usuário"}
                ! 👋
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
                <p className="dark-text-primary text-2xl font-bold">
                  {activeCourses}
                </p>
              </div>
              <div className="dark-primary-subtle-bg rounded-xl p-3">
                <BookOpen className="dark-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {activeCourses > 0
                  ? `${activeCourses} ativos`
                  : "Nenhum curso ativo"}
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Horas Estudadas
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {(userData as any)?.stats?.hoursStudied || 0}h
                </p>
              </div>
              <div className="dark-secondary-subtle-bg rounded-xl p-3">
                <Clock className="dark-secondary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Activity className="dark-secondary mr-1" size={16} />
              <span className="dark-secondary font-medium">
                {(userData as any)?.stats?.lastActivityAt
                  ? "Atividade recente"
                  : "Sem atividade"}
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Certificados
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {certificates}
                </p>
              </div>
              <div className="dark-warning-bg rounded-xl p-3">
                <Award className="dark-warning" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <Star className="dark-warning mr-1" size={16} />
              <span className="dark-warning font-medium">
                {certificates > 0
                  ? `${Math.round((certificates / (completedCourses || 1)) * 100)}% dos cursos`
                  : "Nenhum certificado"}
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Sequência
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {currentStreak} dias
                </p>
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
                <Link href={`/contents`}>
                  <Button className="dark-glass dark-border hover:dark-border-hover text-sm">
                    Ver Todos
                  </Button>
                </Link>
              </div>
              <p className="dark-text-secondary mb-6">
                Retome seus cursos onde parou
              </p>

              <div className="flex flex-col gap-4">
                {activeEnrollments.length > 0 ? (
                  activeEnrollments.map((enrollment: any, index: number) => (
                    <Link key={index} href={`/courses/${enrollment.courseId}`}>
                      <div className="dark-card dark-shadow-sm group cursor-pointer rounded-xl p-4 transition-all hover:shadow-md">
                        <div className="mb-4 flex items-start gap-4">
                          <div className="dark-bg-tertiary flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg">
                            <BookOpen
                              className="dark-text-tertiary"
                              size={24}
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="dark-text-primary group-hover:dark-primary mb-1 font-semibold transition-colors">
                              {enrollment.course?.title || "Curso sem título"}
                            </h3>
                            <p className="dark-text-secondary mb-1 text-sm">
                              Progresso: {Math.round(enrollment.progress || 0)}%
                            </p>
                            <p className="dark-text-tertiary text-xs">
                              Instrutor:{" "}
                              {enrollment.course?.instructor?.name ||
                                "Instrutor não definido"}
                            </p>
                          </div>
                          <Button className="dark-btn-primary cursor-pointer">
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
                              {Math.round(enrollment.progress || 0)}%
                            </span>
                          </div>
                          <div className="dark-bg-tertiary h-2 w-full rounded-full">
                            <div
                              className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${enrollment.progress || 0}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="dark-text-tertiary text-xs">
                              {enrollment.course?.duration
                                ? `${Math.round(enrollment.course.duration / 60)}h restantes`
                                : "Duração não definida"}
                            </p>
                            <div className="flex items-center gap-1">
                              <Clock className="dark-text-tertiary" size={12} />
                              <span className="dark-text-tertiary text-xs">
                                Último acesso:{" "}
                                {enrollment.lastAccessedAt
                                  ? "recente"
                                  : "nunca"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
                    <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <BookOpen className="dark-text-tertiary" size={24} />
                    </div>
                    <h3 className="dark-text-primary mb-2 font-semibold">
                      Nenhum curso ativo
                    </h3>
                    <p className="dark-text-tertiary mb-4 text-sm">
                      Comece a estudar para ver seus cursos aparecerem aqui!
                    </p>
                    <Link href="/catalog">
                      <Button className="dark-btn-primary">
                        Explorar Cursos
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="dark-text-primary flex items-center gap-2 text-xl font-bold">
                  <Calendar className="dark-secondary" size={24} />
                  Próximos Eventos
                </h2>
                <Button
                  className="dark-glass dark-border hover:dark-border-hover text-sm"
                  asChild
                >
                  <Link href={`/events`}>Ver Agenda</Link>
                </Button>
              </div>
              <p className="dark-text-secondary mb-6">
                Não perca essas oportunidades ministeriais
              </p>

              <div className="flex flex-col gap-4">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: any, index: number) => (
                    <Link key={index} href={`/events/${event.id}`}>
                      <div className="dark-card dark-shadow-sm group cursor-pointer rounded-xl p-4 transition-all hover:shadow-md">
                        <div className="flex items-start gap-4">
                          <div className="flex gap-3">
                            <div className="dark-primary-subtle-bg min-w-[60px] rounded-lg p-2 text-center">
                              <div className="dark-primary text-sm font-bold">
                                {formatDate(new Date(event.startDate))}
                              </div>
                              <div className="dark-primary text-xs">
                                {
                                  formatDate(new Date(event.startDate)).split(
                                    " ",
                                  )[1]
                                }
                              </div>
                            </div>
                            <div className="dark-bg-tertiary flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg">
                              <Calendar
                                className="dark-text-tertiary"
                                size={24}
                              />
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
                                {event.tags?.map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))}
                                {event.startDate && (
                                  <span className="dark-warning-bg dark-warning rounded-full px-2 py-1 text-xs font-medium">
                                    {formatTime(new Date(event.startDate))}
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
                    </Link>
                  ))
                ) : (
                  <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
                    <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <Calendar className="dark-text-tertiary" size={24} />
                    </div>
                    <h3 className="dark-text-primary mb-2 font-semibold">
                      Nenhum evento próximo
                    </h3>
                    <p className="dark-text-tertiary mb-4 text-sm">
                      Explore nossa agenda de eventos para participar!
                    </p>
                    <Link href="/events">
                      <Button className="dark-btn-primary">Ver Eventos</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Section */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
                <Activity className="dark-info" size={24} />
                Atividade Recente
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {(userData as any)?.enrollments &&
                (userData as any).enrollments.length > 0 ? (
                  (userData as any).enrollments
                    .filter((e: any) => e.lastAccessedAt || e.enrolledAt)
                    .sort(
                      (a: any, b: any) =>
                        new Date(b.lastAccessedAt || b.enrolledAt).getTime() -
                        new Date(a.lastAccessedAt || a.enrolledAt).getTime(),
                    )
                    .slice(0, 4)
                    .map((enrollment: any, index: number) => (
                      <div
                        key={index}
                        className="dark-card dark-shadow-sm rounded-xl p-4"
                      >
                        <div className="mb-3 flex items-center gap-3">
                          <div
                            className={`${enrollment.completedAt ? "dark-success-bg" : "dark-primary-subtle-bg"} rounded-lg p-2`}
                          >
                            {enrollment.completedAt ? (
                              <Award className="dark-success" size={16} />
                            ) : (
                              <BookOpen className="dark-primary" size={16} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="dark-text-primary text-sm font-medium">
                              {enrollment.completedAt
                                ? "Curso Concluído"
                                : "Curso Acessado"}
                            </h3>
                            <p className="dark-text-tertiary text-xs">
                              {enrollment.lastAccessedAt ||
                              enrollment.enrolledAt
                                ? new Date(
                                    enrollment.lastAccessedAt ||
                                      enrollment.enrolledAt,
                                  ).toLocaleDateString("pt-BR")
                                : "Data não disponível"}
                            </p>
                          </div>
                        </div>
                        <p className="dark-text-secondary text-sm">
                          {enrollment.course?.title || "Curso sem título"}
                        </p>
                      </div>
                    ))
                ) : (
                  <>
                    <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
                      <div className="dark-bg-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                        <Activity className="dark-text-tertiary" size={20} />
                      </div>
                      <h3 className="dark-text-primary text-sm font-medium">
                        Nenhuma atividade
                      </h3>
                      <p className="dark-text-tertiary text-xs">
                        Comece a estudar para ver atividades
                      </p>
                    </div>
                    <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
                      <div className="dark-bg-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                        <BookOpen className="dark-text-tertiary" size={20} />
                      </div>
                      <h3 className="dark-text-primary text-sm font-medium">
                        Sem cursos
                      </h3>
                      <p className="dark-text-tertiary text-xs">
                        Explore nosso catálogo
                      </p>
                    </div>
                  </>
                )}
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
                {user?.name || (userData as any)?.name || "Usuário"}
              </h3>
              <p className="dark-text-secondary mb-4 text-sm">
                {user?.role === "LIDER"
                  ? "Líder"
                  : (userData as any)?.role === "LIDER"
                    ? "Líder"
                    : "Membro"}
              </p>
              <div className="mb-4 flex items-center justify-center gap-4 text-sm">
                <div className="text-center">
                  <div className="dark-text-primary text-lg font-bold">
                    Nível {level}
                  </div>
                  <div className="dark-text-tertiary text-xs">
                    {level >= 10
                      ? "Mestre"
                      : level >= 5
                        ? "Avançado"
                        : level >= 3
                          ? "Intermediário"
                          : "Iniciante"}
                  </div>
                </div>
                <div className="dark-border h-8 w-px" />
                <div className="text-center">
                  <div className="dark-text-primary text-lg font-bold">
                    {totalPoints.toLocaleString()}
                  </div>
                  <div className="dark-text-tertiary text-xs">XP Total</div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="dark-text-tertiary">Próximo nível</span>
                  <span className="dark-primary font-medium">
                    {experience % 100}/100 XP
                  </span>
                </div>
                <div className="dark-bg-tertiary h-2 w-full rounded-full">
                  <div
                    className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${experience % 100}%` }}
                  />
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
                      {(userData as any)?.stats?.hoursStudied || 0}/5h
                    </span>
                  </div>
                  <div className="dark-bg-tertiary h-2 w-full rounded-full">
                    <div
                      className="dark-gradient-secondary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((((userData as any)?.stats?.hoursStudied || 0) / 5) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="dark-success" size={12} />
                    <span className="dark-success text-xs font-medium">
                      {(userData as any)?.stats?.hoursStudied &&
                      (userData as any).stats.hoursStudied >= 5
                        ? "Meta atingida! 🎉"
                        : `Faltam ${5 - ((userData as any)?.stats?.hoursStudied || 0)}h`}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="dark-text-secondary text-sm font-medium">
                      Concluir 2 cursos
                    </span>
                    <span className="dark-primary text-sm font-semibold">
                      {completedCourses}/2
                    </span>
                  </div>
                  <div className="dark-bg-tertiary h-2 w-full rounded-full">
                    <div
                      className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((completedCourses / 2) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="dark-warning" size={12} />
                    <span className="dark-warning text-xs font-medium">
                      {completedCourses >= 2
                        ? "Meta atingida! 🎉"
                        : `${2 - completedCourses} curso${2 - completedCourses > 1 ? "s" : ""} restante${2 - completedCourses > 1 ? "s" : ""}`}
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
                {(userData as any)?.achievements &&
                (userData as any).achievements.length > 0 ? (
                  (userData as any).achievements
                    .slice(0, 3)
                    .map((userAchievement: any, index: number) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {userAchievement.achievement?.icon || "🏆"}
                        </div>
                        <div className="flex-1">
                          <div className="dark-text-primary text-sm font-medium">
                            {userAchievement.achievement?.name || "Conquista"}
                          </div>
                          <div className="dark-text-tertiary text-xs">
                            {userAchievement.achievement?.description ||
                              "Descrição da conquista"}
                          </div>
                        </div>
                        <div className="dark-success-bg h-2 w-2 rounded-full" />
                      </div>
                    ))
                ) : (
                  <>
                    <div className="flex items-center space-x-3 opacity-50">
                      <div className="text-2xl">🔥</div>
                      <div className="flex-1">
                        <div className="dark-text-primary text-sm font-medium">
                          Sequência de 7 dias
                        </div>
                        <div className="dark-text-tertiary text-xs">
                          Mantenha o foco por uma semana
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 opacity-50">
                      <div className="text-2xl">📚</div>
                      <div className="flex-1">
                        <div className="dark-text-primary text-sm font-medium">
                          Primeiro Curso
                        </div>
                        <div className="dark-text-tertiary text-xs">
                          Complete seu primeiro curso
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 opacity-50">
                      <div className="text-2xl">⭐</div>
                      <div className="flex-1">
                        <div className="dark-text-primary text-sm font-medium">
                          Avaliação 5 estrelas
                        </div>
                        <div className="dark-text-tertiary text-xs">
                          Receba uma avaliação perfeita
                        </div>
                      </div>
                    </div>
                  </>
                )}
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
      </div>
    </div>
  );
}
