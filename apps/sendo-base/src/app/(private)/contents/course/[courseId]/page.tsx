"use client";

import { useAuth } from "@/src/hooks";
import {
  getCourseById,
  getUserEnrollmentStatus,
  getUserProgress,
} from "@/src/lib/actions";
import { formatDate } from "@/src/lib/formatters";
import { getLevelFormatted } from "@/src/lib/helpers/level.helper";
import { Button } from "@base-church/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Globe,
  Heart,
  MessageCircle,
  Play,
  Share,
  Star,
  Target,
  User,
  Users,
  Video,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const [courseId, setCourseId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();

  // Resolver params
  useState(() => {
    params.then((resolvedParams) => {
      setCourseId(resolvedParams.courseId);
    });
  });

  // Buscar dados do curso
  const {
    data: courseData,
    isLoading: courseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  // Buscar status da matrícula do usuário
  const {
    data: enrollmentData,
    isLoading: enrollmentLoading,
    refetch: refetchEnrollment,
  } = useQuery({
    queryKey: ["enrollment", courseId, user?.id],
    queryFn: () => getUserEnrollmentStatus(courseId, user!.id),
    enabled: !!courseId && !!user?.id,
  });

  // Buscar progresso do usuário no curso
  const {
    data: progressData,
    isLoading: progressLoading,
    refetch: refetchProgress,
  } = useQuery({
    queryKey: ["progress", courseId, user?.id],
    queryFn: () => getUserProgress(user!.id),
    enabled: !!courseId && !!user?.id,
  });

  const course = courseData?.course as any;
  const enrollment = enrollmentData?.enrollment;
  const progress = progressData?.progress || [];
  const modules = course?.modules || [];
  const reviews = course?.reviews || [];

  // Verificar se o usuário está matriculado e aprovado
  const isEnrolled = enrollment?.status === "approved";
  const enrollmentStatus = enrollment?.status;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return Video;
      case "reading":
        return FileText;
      case "exercise":
        return Target;
      case "quiz":
        return CheckCircle;
      default:
        return BookOpen;
    }
  };

  // Função para verificar se uma lição foi concluída
  const isLessonCompleted = (lessonId: string) => {
    return progress.some((p: any) => p.lessonId === lessonId && p.isCompleted);
  };

  // Função para calcular progresso do curso
  const calculateCourseProgress = () => {
    if (!course || !progress) return 0;

    const totalLessons = modules.reduce(
      (acc: number, module: any) => acc + (module.lessons?.length || 0),
      0,
    );

    const completedLessons = progress.filter(
      (p: any) =>
        p.isCompleted &&
        modules.some((module: any) =>
          module.lessons?.some((lesson: any) => lesson.id === p.lessonId),
        ),
    ).length;

    return totalLessons > 0
      ? Math.round((completedLessons / totalLessons) * 100)
      : 0;
  };

  const courseProgress = calculateCourseProgress();

  // Função para encontrar a próxima lição não concluída
  const getNextLesson = () => {
    for (const module of modules) {
      for (const lesson of module.lessons || []) {
        if (!isLessonCompleted(lesson.id)) {
          return lesson;
        }
      }
    }
    return modules[0]?.lessons[0];
  };

  const nextLesson = getNextLesson();

  // Estados de loading e error
  if (courseLoading || enrollmentLoading || progressLoading) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="dark-glass dark-shadow-md rounded-xl p-8 text-center">
            <div className="dark-text-primary mb-4 text-lg font-semibold">
              Carregando curso...
            </div>
            <div className="dark-text-secondary text-sm">
              Aguarde enquanto buscamos as informações
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (courseError || !course) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="dark-glass dark-shadow-md rounded-xl p-8 text-center">
            <div className="dark-text-primary mb-4 text-lg font-semibold">
              Curso não encontrado
            </div>
            <div className="dark-text-secondary text-sm">
              O curso que você está procurando não existe ou foi removido
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Verificar se o usuário tem acesso ao curso
  if (!isEnrolled) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="flex min-h-screen items-center justify-center">
          <div className="dark-glass dark-shadow-md rounded-xl p-8 text-center">
            <div className="dark-text-primary mb-4 text-lg font-semibold">
              Acesso Negado
            </div>
            <div className="dark-text-secondary text-sm">
              {enrollmentStatus === "pending"
                ? "Sua matrícula está pendente de aprovação"
                : enrollmentStatus === "rejected"
                  ? `Sua matrícula foi rejeitada: ${enrollment?.rejectionReason || "Motivo não informado"}`
                  : "Você precisa estar matriculado para acessar este curso"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Course Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="mb-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-sm font-medium">
                    {getLevelFormatted(course.level).text || "Iniciante"}
                  </span>
                  <span className="dark-success-bg dark-success rounded-full px-3 py-1 text-sm font-medium">
                    Gratuito
                  </span>
                  {course.certificate && (
                    <span className="dark-warning-bg dark-warning rounded-full px-3 py-1 text-sm font-medium">
                      📜 Certificado
                    </span>
                  )}
                </div>
                <h1 className="dark-text-primary mb-3 text-3xl font-bold">
                  {course.title}
                </h1>
                <p className="dark-text-secondary text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="mb-6 flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="dark-primary-subtle-bg rounded-full p-2">
                    <User className="dark-primary" size={16} />
                  </div>
                  <div>
                    <div className="dark-text-primary text-sm font-medium">
                      {course.instructor?.name || "Instrutor não informado"}
                    </div>
                    <div className="dark-text-tertiary text-xs">
                      {course.instructor?.role === "LIDER"
                        ? course.instructor?.isPastor
                          ? "Líder (Pastor)"
                          : "Líder"
                        : course.instructor?.isPastor
                          ? "Membro (Pastor)"
                          : "Membro"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Star className="dark-warning fill-current" size={16} />
                  <span className="dark-text-primary font-semibold">
                    {course.averageRating || 0}
                  </span>
                  <span className="dark-text-tertiary text-sm">
                    ({reviews.length} avaliações)
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <Users className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary text-sm">
                    {course.studentsCount?.toLocaleString() || 0} alunos
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Clock className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">
                    {formatDuration(course.totalDuration || 0)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">
                    {course.totalLessons || 0} aulas
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">Acesso vitalício</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="dark-text-tertiary" size={16} />
                  <span className="dark-text-tertiary">
                    Atualizado em {formatDate(course.lastUpdated)}
                  </span>
                </div>
              </div>
            </div>

            {/* Course Preview - Adaptado para usuários matriculados */}
            <Link
              href={`/contents/course/${courseId}/lessons/${nextLesson?.id}`}
            >
              <div className="dark-card dark-shadow-sm rounded-xl p-6">
                <div className="dark-bg-tertiary mb-4 flex h-48 items-center justify-center rounded-lg">
                  <Play className="dark-text-tertiary" size={48} />
                </div>

                <div className="space-y-4">
                  {/* Progresso do Curso */}
                  <div className="mb-4 text-center">
                    <div className="dark-text-primary mb-1 text-2xl font-bold">
                      {courseProgress}%
                    </div>
                    <div className="dark-text-tertiary mb-2 text-sm">
                      Concluído
                    </div>
                    <div className="dark-bg-tertiary h-2 w-full rounded-full">
                      <div
                        className="dark-gradient-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${courseProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Botão de Continuar Assistindo */}
                  {nextLesson ? (
                    <Button asChild className="dark-btn-primary w-full">
                      <Link
                        href={`/contents/course/${courseId}/lessons/${nextLesson.id}`}
                      >
                        <Play className="mr-2" size={16} />
                        Continuar Assistindo
                      </Link>
                    </Button>
                  ) : (
                    <div className="dark-success-bg dark-success rounded-lg p-4 text-center">
                      <CheckCircle className="mx-auto mb-2" size={20} />
                      <p className="text-sm font-medium">Curso Concluído!</p>
                      <p className="text-xs opacity-80">
                        Parabéns por finalizar o curso
                      </p>
                    </div>
                  )}

                  <Button className="dark-glass dark-border hover:dark-border-hover w-full">
                    <Download className="mr-2" size={16} />
                    Baixar Recursos
                  </Button>

                  <Button className="dark-glass dark-border hover:dark-border-hover w-full">
                    <Heart className="mr-2" size={16} />
                    Adicionar aos Favoritos
                  </Button>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:dark-bg-tertiary"
                  >
                    <Share className="dark-text-secondary" size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:dark-bg-tertiary"
                  >
                    <MessageCircle className="dark-text-secondary" size={16} />
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Course Navigation */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-1">
          <div className="flex items-center space-x-1">
            {[
              { id: "overview", label: "Visão Geral" },
              { id: "curriculum", label: "Conteúdo" },
              { id: "instructor", label: "Instrutor" },
              { id: "reviews", label: "Avaliações" },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                onClick={() => setActiveTab(tab.id)}
                className={`${
                  activeTab === tab.id
                    ? "dark-btn-primary"
                    : "dark-text-secondary hover:dark-text-primary"
                }`}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Course Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                  <h2 className="dark-text-primary mb-4 text-xl font-bold">
                    Sobre este curso
                  </h2>
                  <p className="dark-text-secondary mb-6 leading-relaxed">
                    {course.description}
                  </p>

                  {course.objectives && course.objectives.length > 0 && (
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                      <div>
                        <h3 className="dark-text-primary mb-3 font-semibold">
                          O que você aprenderá
                        </h3>
                        <ul className="space-y-2">
                          {course.objectives.map(
                            (objective: any, index: number) => (
                              <li
                                key={index}
                                className="flex items-start gap-2"
                              >
                                <CheckCircle
                                  className="dark-success mt-0.5 flex-shrink-0"
                                  size={16}
                                />
                                <span className="dark-text-secondary text-sm">
                                  {objective}
                                </span>
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      {course.requirements &&
                        course.requirements.length > 0 && (
                          <div>
                            <h3 className="dark-text-primary mb-3 font-semibold">
                              Pré-requisitos
                            </h3>
                            <ul className="space-y-2">
                              {course.requirements.map(
                                (requirement: any, index: number) => (
                                  <li
                                    key={index}
                                    className="flex items-start gap-2"
                                  >
                                    <Target
                                      className="dark-primary mt-0.5 flex-shrink-0"
                                      size={16}
                                    />
                                    <span className="dark-text-secondary text-sm">
                                      {requirement}
                                    </span>
                                  </li>
                                ),
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h2 className="dark-text-primary mb-6 text-xl font-bold">
                  Conteúdo do Curso
                </h2>

                <div className="space-y-4">
                  {modules.map((module: any) => {
                    const moduleLessons = module.lessons || [];
                    const completedInModule = moduleLessons.filter(
                      (lesson: any) => isLessonCompleted(lesson.id),
                    ).length;
                    const moduleProgress =
                      moduleLessons.length > 0
                        ? Math.round(
                            (completedInModule / moduleLessons.length) * 100,
                          )
                        : 0;

                    return (
                      <div key={module.id} className="dark-card rounded-xl p-4">
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="dark-text-primary font-semibold">
                            {module.title}
                          </h3>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="dark-text-tertiary">
                              {completedInModule}/{moduleLessons.length} aulas
                            </span>
                            <span className="dark-text-tertiary">
                              {formatDuration(module.duration || 0)}
                            </span>
                          </div>
                        </div>

                        {/* Progresso do Módulo */}
                        <div className="mb-4">
                          <div className="dark-bg-tertiary h-1 w-full rounded-full">
                            <div
                              className="dark-gradient-primary h-1 rounded-full transition-all duration-300"
                              style={{ width: `${moduleProgress}%` }}
                            />
                          </div>
                        </div>

                        <p className="dark-text-secondary mb-4 text-sm">
                          {module.description}
                        </p>

                        <div className="space-y-2">
                          {moduleLessons.map((lesson: any) => {
                            const Icon = getTypeIcon(lesson.type || "video");
                            const completed = isLessonCompleted(lesson.id);

                            return (
                              <Link
                                key={lesson.id}
                                href={`/contents/course/${courseId}/lessons/${lesson.id}`}
                                className="hover:dark-bg-secondary flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  {completed ? (
                                    <CheckCircle
                                      className="dark-success"
                                      size={16}
                                    />
                                  ) : (
                                    <div className="dark-bg-tertiary h-4 w-4 rounded-full" />
                                  )}
                                  <Icon
                                    className="dark-text-tertiary"
                                    size={16}
                                  />
                                  <span
                                    className={`text-sm ${
                                      completed
                                        ? "dark-text-secondary"
                                        : "dark-text-primary"
                                    }`}
                                  >
                                    {lesson.title}
                                  </span>
                                </div>
                                <span className="dark-text-tertiary text-xs">
                                  {formatDuration(lesson.duration || 0)}
                                </span>
                              </Link>
                            );
                          }) || (
                            <div className="dark-text-tertiary py-4 text-center text-sm">
                              Nenhuma lição disponível
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === "instructor" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h2 className="dark-text-primary mb-6 text-xl font-bold">
                  Seu Instrutor
                </h2>

                <div className="flex items-start gap-6">
                  <div className="dark-primary-subtle-bg rounded-full p-4">
                    <User className="dark-primary" size={32} />
                  </div>
                  <div className="flex-1">
                    <h3 className="dark-text-primary mb-1 text-lg font-semibold">
                      {course.instructor?.name || "Instrutor não informado"}
                    </h3>
                    <p className="dark-text-secondary mb-2">
                      {course.instructor?.role === "LIDER"
                        ? course.instructor?.isPastor
                          ? "Líder (Pastor)"
                          : "Líder"
                        : course.instructor?.isPastor
                          ? "Membro (Pastor)"
                          : "Membro"}
                    </p>
                    <p className="dark-text-secondary leading-relaxed">
                      {course.instructor?.bio || "Biografia não disponível"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="dark-text-primary text-xl font-bold">
                    Avaliações dos Alunos
                  </h2>
                  <div className="flex items-center gap-2">
                    <Star className="dark-warning fill-current" size={20} />
                    <span className="dark-text-primary text-lg font-bold">
                      {course.averageRating || 0}
                    </span>
                    <span className="dark-text-tertiary">
                      ({reviews.length} avaliações)
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  {reviews.length > 0 ? (
                    reviews.map((review: any) => (
                      <div key={review.id} className="dark-card rounded-xl p-4">
                        <div className="flex items-start gap-4">
                          <div className="dark-primary-subtle-bg rounded-full p-2">
                            <User className="dark-primary" size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="mb-2 flex items-center justify-between">
                              <div>
                                <div className="dark-text-primary text-sm font-medium">
                                  {review.user?.name || "Usuário"}
                                </div>
                                <div className="dark-text-tertiary text-xs">
                                  {review.user?.role === "LIDER"
                                    ? review.user?.isPastor
                                      ? "Líder (Pastor)"
                                      : "Líder"
                                    : review.user?.isPastor
                                      ? "Membro (Pastor)"
                                      : "Membro"}
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`${
                                      i < review.rating
                                        ? "dark-warning fill-current"
                                        : "dark-text-tertiary"
                                    }`}
                                    size={12}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="dark-text-secondary mb-2 text-sm">
                              {review.comment}
                            </p>
                            <p className="dark-text-tertiary text-xs">
                              {formatDate(new Date(review.createdAt))}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="dark-card rounded-xl p-8 text-center">
                      <div className="dark-text-tertiary text-sm">
                        Nenhuma avaliação disponível ainda
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Tags */}
            {course.tags && course.tags.length > 0 && (
              <div className="dark-glass dark-shadow-sm rounded-xl p-6">
                <h3 className="dark-text-primary mb-4 font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag: any) => (
                    <span
                      key={tag}
                      className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Course Stats */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Estatísticas
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Total de aulas
                  </span>
                  <span className="dark-primary font-semibold">
                    {course.totalLessons || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Duração total
                  </span>
                  <span className="dark-primary font-semibold">
                    {formatDuration(course.totalDuration || 0)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Alunos matriculados
                  </span>
                  <span className="dark-primary font-semibold">
                    {course.studentsCount?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Nota média
                  </span>
                  <span className="dark-primary font-semibold">
                    {course.averageRating || 0}/5
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Stats */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Seu Progresso
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Progresso geral
                  </span>
                  <span className="dark-success font-semibold">
                    {courseProgress}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Aulas concluídas
                  </span>
                  <span className="dark-success font-semibold">
                    {progress.filter((p: any) => p.isCompleted).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="dark-text-secondary text-sm">
                    Módulos concluídos
                  </span>
                  <span className="dark-success font-semibold">
                    {
                      modules.filter((module: any) => {
                        const moduleLessons = module.lessons || [];
                        return (
                          moduleLessons.length > 0 &&
                          moduleLessons.every((lesson: any) =>
                            isLessonCompleted(lesson.id),
                          )
                        );
                      }).length
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Related Courses */}
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h3 className="dark-text-primary mb-4 font-semibold">
                Cursos Relacionados
              </h3>
              <div className="space-y-3">
                {[
                  { title: "Discipulado Avançado", rating: 4.7 },
                  { title: "Liderança Ministerial", rating: 4.9 },
                  { title: "Cultura da Igreja", rating: 4.6 },
                ].map((related, index) => (
                  <div key={index} className="dark-card rounded-lg p-3">
                    <h4 className="dark-text-primary mb-1 text-sm font-medium">
                      {related.title}
                    </h4>
                    <div className="flex items-center gap-1">
                      <Star className="dark-warning fill-current" size={12} />
                      <span className="dark-text-tertiary text-xs">
                        {related.rating}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
