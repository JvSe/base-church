"use client";

import { Button } from "@base-church/ui/components/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Award,
  Bookmark,
  Check,
  CheckCircle,
  Circle,
  Clock,
  Loader2,
  Lock,
  Menu,
  MessageCircle,
  Settings,
  Star,
} from "lucide-react";
import Link from "next/link";
import { use, useState } from "react";
import { PdfViewer } from "../../../../../../../components/pdf-viewer";
import { useAuth } from "../../../../../../../hooks/auth";
import {
  generateCertificateForCompletedCourse,
  getLessonWithProgress,
  updateLessonProgress,
} from "../../../../../../../lib/actions/course";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default function LessonPage(props: LessonPageProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [showCertificateNotification, setShowCertificateNotification] =
    useState(false);

  const { courseId, lessonId } = use(props.params);

  // Use React Query para buscar dados da lição
  const {
    data: lessonData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["lesson", lessonId, user?.id],
    queryFn: async () => {
      if (!user?.id || !lessonId) {
        throw new Error("User ID or Lesson ID not available");
      }
      const result = await getLessonWithProgress(lessonId, user.id);

      if (!result.success) {
        throw new Error(result.error || "Erro ao carregar a lição");
      }

      return result;
    },
    enabled: !!user?.id && !!lessonId,
    staleTime: 5 * 60 * 1000, // 5 minutos
    retry: 3,
  });

  // Extrair dados da resposta
  const lesson = lessonData?.lesson;
  const course = lessonData?.course;
  const certificate = lessonData?.certificate;
  const isCompleted = lesson?.isCompleted || false;
  const isWatched = lesson?.isWatched || false;

  // Mutation para atualizar progresso da lição
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { isCompleted?: boolean; watchedAt?: Date }) => {
      if (!user?.id || !lessonId) {
        throw new Error("User ID or Lesson ID not available");
      }
      return await updateLessonProgress(user.id, lessonId, data);
    },
    onSuccess: async (result) => {
      if (result.success) {
        // Invalidar e refazer a query para atualizar os dados
        await queryClient.invalidateQueries({
          queryKey: ["lesson", lessonId, user?.id],
        });

        // Verificar se é a última lição e gerar certificado se necessário
        // TODO: Implementar verificação de última lição quando disponível na API
        if (course?.certificateTemplate && user?.id) {
          try {
            await generateCertificateForCompletedCourse(user.id, courseId);
            setShowCertificateNotification(true);
            setTimeout(() => setShowCertificateNotification(false), 5000);
          } catch (error) {
            console.error("Erro ao gerar certificado:", error);
          }
        }

        setShowSuccessFeedback(true);
        setTimeout(() => setShowSuccessFeedback(false), 3000);
      }
    },
    onError: (error) => {
      console.error("Erro ao atualizar progresso:", error);
    },
  });

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCompleteLesson = async () => {
    if (!user?.id || !lesson || isUpdatingProgress) return;

    setIsUpdatingProgress(true);
    setShowSuccessFeedback(false);

    try {
      await updateProgressMutation.mutateAsync({
        isCompleted: !isCompleted,
        watchedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating lesson progress:", error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="dark-bg-primary flex h-screen items-center justify-center">
        <div className="dark-text-primary text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          <p>Carregando lição...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !lesson || !course) {
    return (
      <div className="dark-bg-primary flex h-screen items-center justify-center">
        <div className="dark-text-primary text-center">
          <p className="mb-4 text-red-500">
            {error instanceof Error ? error.message : "Lição não encontrada"}
          </p>
          <Button asChild>
            <Link href="/contents">Voltar aos Conteúdos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const allLessons = course.modules.flatMap((module: any) =>
    module.lessons.map((lesson: any) => ({
      ...lesson,
      moduleTitle: module.title,
    })),
  );

  const currentLessonIndex = allLessons.findIndex(
    (l: any) => l.id === lesson.id,
  );
  const previousLesson =
    currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson =
    currentLessonIndex < allLessons.length - 1
      ? allLessons[currentLessonIndex + 1]
      : null;

  const filteredLessons = allLessons.filter((l: any) =>
    l.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  console.log("lesson", lesson);
  console.log(
    `lesson - https://www.youtube.com/embed/${lesson.youtubeEmbedId}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&cc_load_policy=1&iv_load_policy=3&autohide=0&color=white&theme=dark`,
  );

  return (
    <div className="dark-bg-primary flex h-screen">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header Navigation */}
        <div className="dark-bg-secondary dark-border-b flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="dark-text-secondary hover:dark-text-primary"
            >
              <Link href={`/contents/course/${course.id}`}>
                <ArrowLeft size={16} className="mr-2" />
                {course.title}
              </Link>
            </Button>
            <span className="dark-text-tertiary text-sm">/</span>
            <span className="dark-text-secondary text-sm">
              {lesson.module.title}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              className="dark-text-secondary hover:dark-text-primary"
            >
              <Settings size={16} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="dark-text-secondary hover:dark-text-primary"
            >
              <Menu size={16} />
            </Button>
          </div>
        </div>

        <div className="flex-1 bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${lesson.youtubeEmbedId}?autoplay=0&controls=1&modestbranding=1&rel=0&showinfo=0&fs=1&cc_load_policy=1&iv_load_policy=3&autohide=0&color=white&theme=dark`}
            title={lesson.title}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            style={{
              border: "none",
              background: "#000",
            }}
          />
          <div className="flex h-full items-center justify-center">
            <div className="dark-text-primary text-center">
              <p className="mb-4">Vídeo não disponível</p>
              {lesson.videoUrl && (
                <Button asChild>
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Abrir no YouTube
                  </a>
                </Button>
              )}
            </div>
          </div>
          )
        </div>

        {/* Lesson Info */}
        <div className="dark-glass dark-shadow-md dark-border flex-[0.2] border-t p-6">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-xl font-bold">
                {lesson.title}
              </h1>
              <p className="dark-text-secondary">{lesson.description}</p>
            </div>

            <div className="flex items-center space-x-3">
              {/* Success Feedback */}
              {showSuccessFeedback && (
                <div className="flex items-center space-x-2 rounded-lg bg-green-500/10 px-3 py-2 text-green-400">
                  <Check size={16} />
                  <span className="text-sm font-medium">
                    {isCompleted
                      ? "Lição marcada como assistida!"
                      : "Lição desmarcada!"}
                  </span>
                </div>
              )}

              {/* Certificate Notification */}
              {showCertificateNotification && (
                <div className="flex items-center space-x-2 rounded-lg bg-blue-500/10 px-3 py-2 text-blue-400">
                  <Award size={16} />
                  <span className="text-sm font-medium">
                    🎉 Parabéns! Certificado gerado automaticamente!
                  </span>
                </div>
              )}

              {/* Complete Lesson Button - Hide for certificate lessons */}
              {lesson.type !== "certificate" && (
                <Button
                  onClick={handleCompleteLesson}
                  disabled={isUpdatingProgress}
                  className={`transition-all duration-200 ${
                    isCompleted
                      ? "dark-success-bg dark-success-border hover:dark-success-bg-hover text-white"
                      : "dark-glass dark-border hover:dark-border-hover"
                  }`}
                  size="sm"
                >
                  {isUpdatingProgress ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isCompleted ? (
                    <CheckCircle size={16} />
                  ) : (
                    <Circle size={16} />
                  )}
                  <span className="ml-2">
                    {isUpdatingProgress
                      ? "Salvando..."
                      : isCompleted
                        ? "Assistida"
                        : "Marcar como assistida"}
                  </span>
                </Button>
              )}

              {/* Certificate Status for certificate lessons */}

              <Button
                variant="ghost"
                size="sm"
                className="hover:dark-bg-tertiary"
              >
                <Bookmark className="dark-text-primary" size={16} />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="dark-text-tertiary flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <Clock size={14} className="mr-1" />
                <span>{formatDuration(lesson.duration || 0)}</span>
              </div>
              <div className="flex items-center">
                <Star size={14} className="dark-secondary mr-1" />
                <span>Avalie esta aula</span>
              </div>
              {lesson.videoUrl && (
                <div className="flex items-center">
                  <a
                    href={lesson.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dark-primary hover:dark-primary-hover flex items-center space-x-2 text-sm font-medium transition-colors"
                  >
                    <svg
                      width={16}
                      height={16}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    <span>Abrir no YouTube</span>
                  </a>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
                <MessageCircle size={16} />
                Assistente IA
              </Button>
              <Button className="dark-btn-primary">Fazer Pergunta</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar - Clean & Simplified */}
      {isSidebarOpen && (
        <div className="dark-glass dark-border dark-shadow-lg flex w-96 flex-col border-l">
          {/* Sidebar Header */}
          <div className="dark-border border-b p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="dark-text-primary font-semibold">
                Conteúdo do Curso
              </h3>
            </div>
          </div>

          {/* Lessons List */}
          <div className="custom-scrollbar flex-1 overflow-y-auto">
            {course.modules.map((module: any) => (
              <div key={module.id} className="dark-border border-b">
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 className="dark-text-primary font-medium">
                        {module.title}
                      </h4>
                      {module.isLocked && (
                        <Lock size={14} className="dark-text-tertiary" />
                      )}
                    </div>
                    <span className="dark-text-tertiary text-sm">
                      {module.lessons.length} aulas •{" "}
                      {formatDuration(
                        module.lessons.reduce(
                          (total: number, l: any) => total + (l.duration || 0),
                          0,
                        ),
                      )}
                    </span>
                  </div>

                  {module.isLocked && (
                    <div className="mb-2 rounded-lg bg-yellow-500/10 px-3 py-2">
                      <p className="dark-text-yellow text-xs">
                        🔒 Complete todas as aulas para desbloquear
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1 pb-4">
                  {module.lessons.map((moduleLesson: any) => (
                    <div key={moduleLesson.id}>
                      {moduleLesson.isLocked ? (
                        <div className="mx-4 flex cursor-not-allowed items-center space-x-3 rounded-lg px-4 py-3 opacity-50">
                          <Lock
                            size={16}
                            className="dark-text-tertiary flex-shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="dark-text-tertiary truncate text-sm font-medium">
                              {moduleLesson.title}
                            </p>
                            <p className="dark-text-tertiary text-xs">
                              🔒 Bloqueado
                            </p>
                          </div>
                          <span className="dark-text-tertiary flex-shrink-0 text-xs">
                            --
                          </span>
                        </div>
                      ) : (
                        <Link
                          href={`/contents/course/${course.id}/lessons/${moduleLesson.id}`}
                          className={`mx-4 flex cursor-pointer items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                            moduleLesson.id === lesson.id
                              ? "dark-gradient-primary text-white shadow-lg"
                              : "hover:dark-bg-tertiary hover:shadow-sm"
                          }`}
                        >
                          {moduleLesson.isCompleted ? (
                            <CheckCircle
                              size={16}
                              className="dark-success flex-shrink-0"
                            />
                          ) : moduleLesson.isWatched ? (
                            <Circle
                              size={16}
                              className="dark-primary flex-shrink-0"
                            />
                          ) : moduleLesson.type === "certificate" ? (
                            <Award
                              size={16}
                              className="dark-success flex-shrink-0"
                            />
                          ) : (
                            <Circle
                              size={16}
                              className="dark-text-tertiary flex-shrink-0"
                            />
                          )}

                          <div className="min-w-0 flex-1">
                            <p
                              className={`truncate text-sm font-medium ${
                                moduleLesson.id === lesson.id
                                  ? "text-white"
                                  : "dark-text-primary"
                              }`}
                            >
                              {moduleLesson.title}
                            </p>
                          </div>

                          <span
                            className={`flex-shrink-0 text-xs ${
                              moduleLesson.id === lesson.id
                                ? "text-white/80"
                                : "dark-text-tertiary"
                            }`}
                          >
                            {formatDuration(moduleLesson.duration || 0)}
                          </span>
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="dark-border mt-auto mb-6 border-t">
            <div className="p-4 transition-all duration-300 hover:-translate-y-1">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="dark-text-primary font-medium">
                    Certificado de Conclusão
                  </h4>
                  {certificate ? (
                    <Award size={14} className="dark-success" />
                  ) : (
                    <Lock size={14} className="dark-text-tertiary" />
                  )}
                </div>
              </div>

              {certificate ? (
                <PdfViewer
                  pdfBase64={certificate.template?.templateUrl || undefined}
                  certificateUrl={
                    certificate.template?.templateUrl || undefined
                  }
                  title={`Certificado: ${course.title}`}
                  fileName={`certificado-${course.title.replace(/\s+/g, "-").toLowerCase()}.pdf`}
                >
                  <div className="cursor-pointer space-y-3">
                    <div className="rounded-lg bg-green-500/10 p-3">
                      <div className="mb-2 flex items-center space-x-2">
                        <CheckCircle size={16} className="dark-success" />
                        <span className="dark-text-success text-sm font-medium">
                          🎉 Certificado Disponível!
                        </span>
                      </div>
                      <p className="dark-text-secondary text-xs">
                        Parabéns! Você concluiu o curso e pode baixar seu
                        certificado.
                      </p>
                    </div>

                    {/* <div className="space-y-2">
                        <div className="dark-glass dark-border rounded-lg p-3">
                          <div className="mb-1 flex items-center space-x-2">
                            <Award size={12} className="dark-text-secondary" />
                            <span className="dark-text-secondary text-xs font-medium">
                              Código de Verificação
                            </span>
                          </div>
                          <p className="dark-text-primary font-mono text-xs">
                            {certificate.verificationCode}
                          </p>
                          <p className="dark-text-tertiary mt-1 text-xs">
                            Use este código para verificar a autenticidade
                          </p>
                        </div>
                      </div> */}
                  </div>
                </PdfViewer>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-yellow-500/10 p-3">
                    <div className="mb-2 flex items-center space-x-2">
                      <Lock size={16} className="dark-text-yellow" />
                      <span className="dark-text-yellow text-sm font-medium">
                        🔒 Certificado Bloqueado
                      </span>
                    </div>
                    <p className="dark-text-secondary text-xs">
                      Complete todas as aulas do curso para desbloquear seu
                      certificado.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
