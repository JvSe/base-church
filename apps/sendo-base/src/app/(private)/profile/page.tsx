"use client";

import { PageLayout } from "@/src/components/common/layout/page-layout";
import { Section } from "@/src/components/common/layout/section";
import { useAuth, usePageTitle } from "@/src/hooks";
import { getUserProfile } from "@/src/lib/actions";
import { getInitials } from "@/src/lib/get-initial-by-name";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@base-church/ui/components/avatar";
import { Button } from "@base-church/ui/components/button";
import { cn } from "@base-church/ui/lib/utils";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  Edit,
  Flame,
  Mail,
  Phone,
  Plus,
  Target,
  Trophy,
  Zap,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProfilePage() {
  usePageTitle("Perfil");

  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  const { data: userAuth } = useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => getUserProfile(user!.id),
    select: (data) => data.user,
    enabled: !!user?.id,
  });

  const calculateProfileCompletion = (user: any) => {
    if (!user) return 0;

    const fields = [
      user.name,
      user.email,
      user.image,
      user.bio,
      user.phone,
      user.cpf,
      user.birthDate,
    ];

    const filledFields = fields.filter(
      (field) => field && typeof field === "string" && field.trim() !== "",
    ).length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "dark-warning dark-warning-bg";
      case "approved":
        return "dark-success dark-success-bg";
      case "rejected":
        return "dark-error dark-error-bg";
      default:
        return "dark-text-tertiary dark-bg-tertiary";
    }
  };

  const getEnrollmentStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Matrícula Pendente";
      case "approved":
        return "Matrícula Aprovada";
      case "rejected":
        return "Matrícula Rejeitada";
      default:
        return "Desconhecido";
    }
  };

  // Use real user data with fallbacks
  const profileCompletion = calculateProfileCompletion(userAuth);
  const coursesCompleted =
    userAuth?.enrollments?.filter((e) => e.completedAt)?.length || 0;
  const certificatesEarned = userAuth?.certificates?.length || 0;
  const hoursStudied =
    userAuth?.enrollments?.reduce((total: number, enrollment: any) => {
      return total + (enrollment.course?.duration || 0);
    }, 0) || 0;

  // Empty state component
  const EmptyStateCard = ({
    icon: Icon,
    title,
    description,
    actionText,
    onAction,
  }: {
    icon: any;
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
  }) => (
    <div className="dark-card dark-shadow-sm rounded-xl p-6 text-center">
      <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className="dark-text-tertiary" size={24} />
      </div>
      <h3 className="dark-text-primary mb-2 font-semibold">{title}</h3>
      <p className="dark-text-tertiary mb-4 text-sm">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="dark-btn-primary">
          {actionText}
        </Button>
      )}
    </div>
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} dia${days > 1 ? "s" : ""} atrás`;
    if (hours > 0) return `${hours} hora${hours > 1 ? "s" : ""} atrás`;
    return "Agora mesmo";
  };

  return (
    <PageLayout spacing="normal">
      {/* Header Profile */}
      <div className="dark-glass dark-shadow-md rounded-2xl p-8">
        <div className="mb-6 flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="dark-primary-subtle-bg h-24 min-h-24 w-24 min-w-24 overflow-hidden rounded-full">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={userAuth?.image ?? ""}
                  alt={userAuth?.name ?? ""}
                  className="h-full w-full"
                />
                <AvatarFallback className="rounded-full">
                  {getInitials(userAuth?.name ?? "")}
                </AvatarFallback>
              </Avatar>
              {/* <User className="dark-primary" size={48} /> */}
            </div>
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                {userAuth?.name}
              </h1>
              <p className="dark-text-secondary mb-2 text-lg">
                {userAuth?.role === "ADMIN"
                  ? "Administrador"
                  : userAuth?.role === "LIDER"
                    ? "Líder"
                    : "Membro"}
              </p>
              <p className="dark-text-tertiary mb-4 max-w-2xl">
                {userAuth?.bio ||
                  "Perfil em construção. Adicione uma biografia para compartilhar sua jornada ministerial."}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center space-x-1">
                  <Calendar className="dark-text-tertiary" size={14} />
                  <span className="dark-text-tertiary text-nowrap">
                    Desde {formatDate(userAuth?.joinDate ?? new Date())}
                  </span>
                </div>
                {userAuth?.email && (
                  <div className="flex items-center space-x-1">
                    <Mail className="dark-text-tertiary" size={14} />
                    <span className="dark-text-tertiary text-nowrap">
                      {userAuth.email}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button asChild variant="info" className="gap-2">
              <Link href="/profile/account">
                <Edit size={16} />
                Editar Perfil
              </Link>
            </Button>
            {/* <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
                <Share size={16} />
                Compartilhar
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover">
                <Settings size={16} />
              </Button> */}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {coursesCompleted}
            </div>
            <div className="dark-text-tertiary text-sm">Cursos Concluídos</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {certificatesEarned}
            </div>
            <div className="dark-text-tertiary text-sm">Certificados</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 text-2xl font-bold">
              {Math.round(hoursStudied / 60)}h
            </div>
            <div className="dark-text-tertiary text-sm">Horas de Estudo</div>
          </div>

          <div className="dark-bg-secondary rounded-lg p-4 text-center">
            <div className="dark-text-primary mb-1 flex items-center justify-center gap-1 text-2xl font-bold">
              <Flame className="dark-error" size={20} />
              {userAuth?.currentStreak ?? 0}
            </div>
            <div className="dark-text-tertiary text-sm">Sequência Atual</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Achievements Section */}
          <Section
            title={
              <span className="flex items-center gap-2">
                <Trophy className="dark-secondary" size={24} />
                Conquistas (0)
              </span>
            }
          >
            <EmptyStateCard
              icon={Trophy}
              title="Nenhuma conquista ainda"
              description="Complete cursos e participe de atividades para desbloquear suas primeiras conquistas!"
              actionText="Explorar Cursos"
              onAction={() => (window.location.href = "/catalog")}
            />
          </Section>

          {/* Courses Progress */}
          <Section
            title={
              <span className="flex items-center gap-2">
                <BookOpen className="dark-primary" size={24} />
                Meus Cursos ({userAuth?.enrollments?.length || 0})
              </span>
            }
            right={
              userAuth?.enrollments && userAuth.enrollments.length > 0 ? (
                <Button className="dark-glass dark-border hover:dark-border-hover">
                  Ver Todos
                </Button>
              ) : undefined
            }
          >
            {userAuth?.enrollments && userAuth.enrollments.length > 0 ? (
              <div className="flex flex-col gap-4">
                {userAuth.enrollments.slice(0, 4).map((enrollment: any) => (
                  <Link
                    key={enrollment.id}
                    href={`/contents/course/${enrollment.course.id}`}
                  >
                    <div
                      className={cn(
                        "dark-card dark-shadow-sm rounded-lg p-4 shadow-2xl transition-all duration-300",
                        enrollment.progress === 100 &&
                          "border-l-4 border-l-green-400",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="mb-2 flex items-center gap-3">
                            <div className="relative">
                              {enrollment.course?.image ? (
                                <div className="dark-bg-tertiary flex h-20 w-40 items-center justify-center overflow-hidden rounded-xl">
                                  <Image
                                    src={enrollment.course.image}
                                    alt={
                                      enrollment.course.title ||
                                      "Curso sem imagem"
                                    }
                                    fill
                                    className="rounded-lg object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="dark-bg-tertiary flex h-20 w-20 items-center justify-center rounded-lg">
                                  <BookOpen
                                    className="dark-text-tertiary"
                                    size={24}
                                  />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="dark-text-primary font-semibold">
                                {enrollment.course?.title || "Curso sem título"}
                              </h3>
                              <p className="dark-text-tertiary text-sm">
                                Instrutor:{" "}
                                <span className="dark-text-primary font-medium">
                                  {enrollment.course?.instructor?.name ||
                                    "Instrutor não definido"}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium ${getEnrollmentStatusColor(enrollment.status)}`}
                            >
                              {getEnrollmentStatusText(enrollment.status)}
                            </span>
                          </div>

                          {enrollment.status === "approved" && (
                            <div className="text-right">
                              <span className="dark-primary text-sm font-medium">
                                {Math.round(enrollment.progress || 0)}% completo
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {enrollment.status === "approved" && (
                        <div className="dark-bg-tertiary mt-3 h-2 w-full rounded-full">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              enrollment.progress === 100
                                ? "bg-dark-success"
                                : "dark-gradient-primary"
                            }`}
                            style={{ width: `${enrollment.progress || 0}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyStateCard
                icon={BookOpen}
                title="Nenhum curso matriculado"
                description="Explore nosso catálogo e comece sua jornada de aprendizado hoje mesmo!"
                actionText="Ver Catálogo"
                onAction={() => (window.location.href = "/catalog")}
              />
            )}
          </Section>

          {/* Recent Activity */}
          <Section
            title={
              <span className="flex items-center gap-2">
                <Zap className="dark-info" size={24} />
                Atividade Recente
              </span>
            }
          >
            {/* Generate recent activities from user data */}
            {userAuth?.enrollments && userAuth.enrollments.length > 0 ? (
              <div className="space-y-4">
                {userAuth.enrollments
                  .filter((e: any) => e.lastAccessedAt || e.enrolledAt)
                  .sort(
                    (a: any, b: any) =>
                      new Date(b.lastAccessedAt || b.enrolledAt).getTime() -
                      new Date(a.lastAccessedAt || a.enrolledAt).getTime(),
                  )
                  .slice(0, 5)
                  .map((enrollment: any) => (
                    <div
                      key={enrollment.id}
                      className="flex items-start space-x-4"
                    >
                      <div className="dark-primary-subtle-bg flex-shrink-0 rounded-full p-2">
                        {enrollment.completedAt ? (
                          <Trophy className="dark-primary" size={16} />
                        ) : (
                          <BookOpen className="dark-primary" size={16} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h3 className="dark-text-primary mb-1 font-medium">
                          {enrollment.completedAt
                            ? `Concluiu o curso "${enrollment.course?.title || "Curso"}"`
                            : `Acessou o curso "${enrollment.course?.title || "Curso"}"`}
                        </h3>
                        <p className="dark-text-tertiary mb-1 text-sm">
                          {enrollment.completedAt
                            ? `Parabéns pela conclusão! ${enrollment.course?.certificate ? "Certificado disponível." : ""}`
                            : `Progresso atual: ${Math.round(enrollment.progress || 0)}%`}
                        </p>
                        <p className="dark-text-tertiary text-xs">
                          {formatRelativeTime(
                            new Date(
                              enrollment.lastAccessedAt ||
                                enrollment.enrolledAt,
                            ),
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <EmptyStateCard
                icon={Zap}
                title="Nenhuma atividade recente"
                description="Comece a estudar para ver suas atividades aparecerem aqui!"
                actionText="Explorar Conteúdo"
                onAction={() => (window.location.href = "/contents")}
              />
            )}
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Section
            title={
              <span className="flex items-center gap-2">
                <Target className="dark-warning" size={20} />
                Completar Perfil
              </span>
            }
          >
            <div className="mb-4">
              <div className="mb-2 flex justify-between text-sm">
                <span className="dark-text-secondary">Progresso</span>
                <span className="dark-primary font-semibold">
                  {profileCompletion}%
                </span>
              </div>
              <div className="dark-bg-tertiary h-2 rounded-full">
                <div
                  className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profileCompletion}%` }}
                />
              </div>
            </div>

            <div className="space-y-2">
              {(!userAuth?.image || !userAuth?.bio || !userAuth?.phone) && (
                <Link href="/profile/account">
                  <Button
                    variant="success"
                    className="w-full justify-start text-sm"
                  >
                    <Plus className="mr-2" size={14} />
                    Completar perfil
                  </Button>
                </Link>
              )}
            </div>
          </Section>

          {/* Contact Info */}
          <Section title="Informações de Contato">
            {userAuth?.email || userAuth?.phone ? (
              <div className="space-y-3">
                {userAuth?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="dark-text-tertiary" size={16} />
                    <span className="dark-text-secondary text-sm">
                      {userAuth.email}
                    </span>
                  </div>
                )}
                {userAuth?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="dark-text-tertiary" size={16} />
                    <span className="dark-text-secondary text-sm">
                      {userAuth.phone}
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center">
                <div className="dark-bg-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                  <Mail className="dark-text-tertiary" size={20} />
                </div>
                <p className="dark-text-tertiary text-sm">
                  Nenhuma informação de contato adicionada
                </p>
                <Button className="dark-btn-primary mt-3 text-xs" size="sm">
                  Adicionar Informações
                </Button>
              </div>
            )}
          </Section>

          {/* Quick Actions */}
          {/* <Section title="Ações Rápidas">
            <div className="space-y-2">
              <Button className="dark-btn-primary w-full justify-start">
                <BookOpen className="mr-2" size={16} />
                Continuar Estudos
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                <Download className="mr-2" size={16} />
                Baixar Certificados
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                <Share className="mr-2" size={16} />
                Compartilhar Perfil
              </Button>
              <Button className="dark-glass dark-border hover:dark-border-hover w-full justify-start">
                <MessageCircle className="mr-2" size={16} />
                Falar com Mentor
              </Button>
            </div>
          </Section> */}
        </div>
      </div>
    </PageLayout>
  );
}
