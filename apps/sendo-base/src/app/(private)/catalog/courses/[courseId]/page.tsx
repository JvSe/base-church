"use client";

import { PageLayout } from "@/src/components/common/layout/page-layout";
import { useAuth } from "@/src/hooks";
import {
  createEnrollmentRequest,
  getCourseById,
  getUserEnrollmentStatus,
} from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Globe,
  Info,
  Play,
  Star,
  Target,
  User,
  Users,
  Video,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CoursePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default function CoursePage({ params }: CoursePageProps) {
  const [courseId, setCourseId] = useState<string>("");
  const [activeTab, setActiveTab] = useState("overview");
  const userId = useAuth((state) => state.user?.id); // TODO: Obter ID do usuário logado

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
    queryKey: ["enrollment", courseId, userId],
    queryFn: () => getUserEnrollmentStatus(courseId, userId || ""),
    enabled: !!courseId && !!userId,
  });

  const course = courseData?.course as any;
  const enrollment = enrollmentData?.enrollment;
  const modules = course?.modules || [];
  const reviews = course?.reviews || [];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR");
  };

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

  const handleEnrollmentRequest = async () => {
    try {
      const result = await createEnrollmentRequest(courseId, userId || "");

      if (result.success) {
        toast.success(result.message);
        refetchEnrollment();
      }
    } catch (error) {
      console.error(error);
      toast.error(
        (error as any).error || "Erro ao enviar solicitação de matrícula",
      );
    }
  };

  // Estados de loading e error
  if (courseLoading || enrollmentLoading) {
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

  // Determinar status da matrícula
  const isEnrolled =
    enrollment?.status === "pending" || enrollment?.status === "approved";
  const enrollmentStatus = enrollment?.status;

  return (
    <PageLayout spacing="normal">
      {/* Course Header */}
      <div className="dark-glass dark-shadow-md rounded-2xl p-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="dark-primary-subtle-bg dark-primary rounded-full px-3 py-1 text-sm font-medium">
                  {course.level || "Iniciante"}
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
                    {course.instructor?.role === "ADMIN"
                      ? course.instructor?.isPastor
                        ? "Administrador (Pastor)"
                        : "Administrador"
                      : course.instructor?.role === "LIDER"
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

          {/* Course Preview */}

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="dark-bg-tertiary mb-4 flex h-48 items-center justify-center rounded-lg">
              <Play className="dark-text-tertiary" size={48} />
            </div>

            <div className="space-y-4">
              {!enrollment ? (
                <Button
                  className="dark-btn-primary w-full"
                  onClick={handleEnrollmentRequest}
                >
                  <Play className="mr-2" size={16} />
                  Solicitar Matrícula
                </Button>
              ) : enrollmentStatus === "pending" ? (
                <div className="dark-warning-bg dark-warning rounded-lg p-4 text-center">
                  <Info className="mx-auto mb-2" size={20} />
                  <p className="text-sm font-medium">Solicitação Pendente</p>
                  <p className="text-xs opacity-80">
                    Aguarde aprovação dos líderes
                  </p>
                </div>
              ) : enrollmentStatus === "approved" ? (
                <div className="dark-success-bg dark-success rounded-lg p-4 text-center">
                  <CheckCircle className="mx-auto mb-2" size={20} />
                  <p className="text-sm font-medium">Matrícula Aprovada</p>
                  <p className="text-xs opacity-80">Você tem acesso ao curso</p>
                </div>
              ) : enrollmentStatus === "rejected" ? (
                <div className="dark-error-bg dark-error rounded-lg p-4 text-center">
                  <Info className="mx-auto mb-2" size={20} />
                  <p className="text-sm font-medium">Matrícula Rejeitada</p>
                  <p className="text-xs opacity-80">
                    {enrollment.rejectionReason || "Motivo não informado"}
                  </p>
                </div>
              ) : null}
            </div>
          </div>
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
                            <li key={index} className="flex items-start gap-2">
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

                    {course.requirements && course.requirements.length > 0 && (
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

                {/* Processo de Matrícula */}
                <div className="dark-card dark-border mt-6 rounded-xl p-6">
                  <h3 className="dark-text-primary mb-4 flex items-center gap-2 font-semibold">
                    <Info className="dark-primary" size={20} />
                    Como funciona a matrícula?
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="dark-primary-subtle-bg dark-primary flex h-6 min-w-[24px] items-center justify-center rounded-full p-1 text-xs font-bold">
                        1
                      </div>
                      <div>
                        <p className="dark-text-primary text-sm font-medium">
                          Solicite sua matrícula
                        </p>
                        <p className="dark-text-secondary text-xs">
                          Clique em "Solicitar Matrícula" para enviar sua
                          solicitação
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="dark-primary-subtle-bg dark-primary flex h-6 min-w-[24px] items-center justify-center rounded-full p-1 text-xs font-bold">
                        2
                      </div>
                      <div>
                        <p className="dark-text-primary text-sm font-medium">
                          Aguarde aprovação
                        </p>
                        <p className="dark-text-secondary text-xs">
                          Os líderes da igreja analisarão sua solicitação
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="dark-primary-subtle-bg dark-primary flex h-6 min-w-[24px] items-center justify-center rounded-full p-1 text-xs font-bold">
                        3
                      </div>
                      <div>
                        <p className="dark-text-primary text-sm font-medium">
                          Acesso liberado
                        </p>
                        <p className="dark-text-secondary text-xs">
                          Após aprovação, você terá acesso completo ao curso
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "curriculum" && (
            <div className="dark-glass dark-shadow-sm rounded-xl p-6">
              <h2 className="dark-text-primary mb-6 text-xl font-bold">
                Conteúdo do Curso
              </h2>

              <div className="space-y-4">
                {modules.map((module: any) => (
                  <div key={module.id} className="dark-card rounded-xl p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="dark-text-primary font-semibold">
                        {module.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="dark-text-tertiary">
                          {module.lessons?.length || 0} aulas
                        </span>
                        <span className="dark-text-tertiary">
                          {formatDuration(module.duration || 0)}
                        </span>
                      </div>
                    </div>
                    <p className="dark-text-secondary mb-4 text-sm">
                      {module.description}
                    </p>

                    <div className="space-y-2">
                      {module.lessons?.map((lesson: any) => {
                        const Icon = getTypeIcon(lesson.type || "video");
                        return (
                          <div
                            key={lesson.id}
                            className="hover:dark-bg-secondary flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="dark-text-tertiary" size={16} />
                              <span className="dark-text-primary text-sm">
                                {lesson.title}
                              </span>
                            </div>
                            <span className="dark-text-tertiary text-xs">
                              {formatDuration(lesson.duration || 0)}
                            </span>
                          </div>
                        );
                      }) || (
                        <div className="dark-text-tertiary py-4 text-center text-sm">
                          Nenhuma lição disponível
                        </div>
                      )}
                    </div>
                  </div>
                ))}
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
                    {course.instructor?.role === "ADMIN"
                      ? course.instructor?.isPastor
                        ? "Administrador (Pastor)"
                        : "Administrador"
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
                                {review.user?.role === "ADMIN"
                                  ? review.user?.isPastor
                                    ? "Administrador (Pastor)"
                                    : "Administrador"
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
                <span className="dark-text-secondary text-sm">Nota média</span>
                <span className="dark-primary font-semibold">
                  {course.averageRating || 0}/5
                </span>
              </div>
            </div>
          </div>

          {/* Related Courses */}
          {/* <div className="dark-glass dark-shadow-sm rounded-xl p-6">
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
            </div> */}
        </div>
      </div>
    </PageLayout>
  );
}
