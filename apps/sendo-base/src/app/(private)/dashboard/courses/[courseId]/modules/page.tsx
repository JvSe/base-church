"use client";

import {
  createLesson,
  createModule,
  deleteLesson,
  deleteModule,
  getCourseModules,
} from "@/src/lib/actions";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Edit,
  Eye,
  GripVertical,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  order: number;
  type: "video" | "text" | "quiz";
  isCompleted: boolean;
}

interface ModulesPageProps {
  params: {
    courseId: string;
  };
}

export default function ModulesPage({ params }: ModulesPageProps) {
  const [isAddingModule, setIsAddingModule] = useState(false);
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [newModuleDescription, setNewModuleDescription] = useState("");
  const router = useRouter();

  // Buscar módulos do banco
  const {
    data: modulesData,
    isLoading: modulesLoading,
    error: modulesError,
    refetch: refetchModules,
  } = useQuery({
    queryKey: ["course-modules", params.courseId],
    queryFn: () => getCourseModules(params.courseId),
    select: (data) => data.modules,
  });

  // Transformar dados do banco para o formato da interface
  const modules: Module[] =
    modulesData?.map((module: any) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      order: module.order,
      lessons:
        module.lessons?.map((lesson: any) => ({
          id: lesson.id,
          title: lesson.title,
          description: lesson.description,
          duration: lesson.duration,
          order: lesson.order,
          type: lesson.type,
          isCompleted: false, // TODO: Implementar progresso do usuário
        })) || [],
    })) || [];

  const handleAddModule = async () => {
    if (!newModuleTitle.trim()) {
      toast.error("Título do módulo é obrigatório");
      return;
    }

    try {
      const result = await createModule(params.courseId, {
        title: newModuleTitle,
        description: newModuleDescription,
        order: modules.length + 1,
      });

      if (result.success) {
        setNewModuleTitle("");
        setNewModuleDescription("");
        setIsAddingModule(false);
        toast.success(result.message);
        refetchModules(); // Recarregar dados do banco
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao criar módulo");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm("Tem certeza que deseja excluir este módulo?")) {
      try {
        const result = await deleteModule(moduleId);

        if (result.success) {
          toast.success(result.message);
          refetchModules(); // Recarregar dados do banco
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Erro ao excluir módulo");
      }
    }
  };

  const handleAddLesson = async (moduleId: string) => {
    const module = modules.find((m) => m.id === moduleId);
    if (!module) return;

    try {
      const result = await createLesson(moduleId, {
        title: "Nova Lição",
        description: "Descrição da lição",
        duration: 15,
        order: module.lessons.length + 1,
        type: "video",
      });

      if (result.success) {
        toast.success(result.message);
        refetchModules(); // Recarregar dados do banco
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Erro ao criar lição");
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (confirm("Tem certeza que deseja excluir esta lição?")) {
      try {
        const result = await deleteLesson(lessonId);

        if (result.success) {
          toast.success(result.message);
          refetchModules(); // Recarregar dados do banco
        } else {
          toast.error(result.error);
        }
      } catch (error) {
        toast.error("Erro ao excluir lição");
      }
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const getLessonTypeIcon = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return <Play className="h-4 w-4" />;
      case "text":
        return <BookOpen className="h-4 w-4" />;
      case "quiz":
        return <Edit className="h-4 w-4" />;
      default:
        return <BookOpen className="h-4 w-4" />;
    }
  };

  const getLessonTypeText = (type: Lesson["type"]) => {
    switch (type) {
      case "video":
        return "Vídeo";
      case "text":
        return "Texto";
      case "quiz":
        return "Quiz";
      default:
        return "Conteúdo";
    }
  };

  // Loading state
  if (modulesLoading) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-6xl space-y-8 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <BookOpen className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Carregando módulos...
            </h1>
            <p className="dark-text-secondary">
              Buscando módulos e lições do curso
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (modulesError) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-6xl space-y-8 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <BookOpen className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Erro ao carregar módulos
            </h1>
            <p className="dark-text-secondary mb-4">
              Não foi possível carregar os módulos do curso. Tente novamente.
            </p>
            <Button
              className="dark-btn-primary"
              onClick={() => refetchModules()}
            >
              Tentar Novamente
            </Button>
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

      <div className="relative mx-auto max-w-6xl space-y-8 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.back()}
                className="dark-glass dark-border hover:dark-border-hover"
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                  Módulos e Lições
                </h1>
                <p className="dark-text-secondary">
                  Organize o conteúdo do seu curso em módulos e lições
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setIsAddingModule(true)}
                className="dark-btn-primary"
              >
                <Plus className="mr-2 h-4 w-4" />
                Novo Módulo
              </Button>
            </div>
          </div>
        </div>

        {/* Add Module Form */}
        {isAddingModule && (
          <div className="dark-glass dark-shadow-sm rounded-xl p-6">
            <h2 className="dark-text-primary mb-4 text-xl font-bold">
              Adicionar Novo Módulo
            </h2>
            <div className="space-y-4">
              <div>
                <label className="dark-text-secondary mb-2 block text-sm font-medium">
                  Título do Módulo *
                </label>
                <Input
                  value={newModuleTitle}
                  onChange={(e) => setNewModuleTitle(e.target.value)}
                  placeholder="Ex: Introdução à Fé Cristã"
                  className="dark-input"
                />
              </div>
              <div>
                <label className="dark-text-secondary mb-2 block text-sm font-medium">
                  Descrição
                </label>
                <Input
                  value={newModuleDescription}
                  onChange={(e) => setNewModuleDescription(e.target.value)}
                  placeholder="Descreva o que será abordado neste módulo"
                  className="dark-input"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={handleAddModule} className="dark-btn-primary">
                  Adicionar Módulo
                </Button>
                <Button
                  onClick={() => {
                    setIsAddingModule(false);
                    setNewModuleTitle("");
                    setNewModuleDescription("");
                  }}
                  className="dark-glass dark-border hover:dark-border-hover"
                  variant="outline"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modules List */}
        <div className="space-y-6">
          {modules.map((module, moduleIndex) => (
            <div
              key={module.id}
              className="dark-glass dark-shadow-sm rounded-xl p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="dark-primary-subtle-bg flex h-10 w-10 items-center justify-center rounded-lg">
                    <GripVertical className="dark-primary" size={20} />
                  </div>
                  <div>
                    <h3 className="dark-text-primary text-lg font-semibold">
                      Módulo {module.order}: {module.title}
                    </h3>
                    <p className="dark-text-secondary text-sm">
                      {module.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="dark-text-tertiary">
                        {module.lessons.length} lições
                      </span>
                      <span className="dark-text-tertiary">
                        {formatDuration(
                          module.lessons.reduce(
                            (total, lesson) => total + lesson.duration,
                            0,
                          ),
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="dark-glass dark-border hover:dark-border-hover"
                    onClick={() => handleAddLesson(module.id)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    className="dark-glass dark-border hover:dark-border-hover"
                    onClick={() => {
                      // TODO: Implementar edição de módulo
                      toast.info("Funcionalidade de edição em desenvolvimento");
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    className="dark-glass dark-border hover:dark-border-hover"
                    onClick={() => handleDeleteModule(module.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Lessons List */}
              <div className="space-y-3">
                {module.lessons.length > 0 ? (
                  module.lessons.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id}
                      className="dark-card dark-shadow-sm rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="dark-secondary-subtle-bg flex h-8 w-8 items-center justify-center rounded-lg">
                            {getLessonTypeIcon(lesson.type)}
                          </div>
                          <div>
                            <h4 className="dark-text-primary font-medium">
                              {lesson.order}. {lesson.title}
                            </h4>
                            <p className="dark-text-secondary text-sm">
                              {lesson.description}
                            </p>
                            <div className="mt-1 flex items-center space-x-3 text-xs">
                              <span className="dark-text-tertiary">
                                {getLessonTypeText(lesson.type)}
                              </span>
                              <span className="dark-text-tertiary">
                                <Clock className="mr-1 inline h-3 w-3" />
                                {formatDuration(lesson.duration)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="dark-glass dark-border hover:dark-border-hover"
                            onClick={() => {
                              // TODO: Implementar visualização de lição
                              toast.info(
                                "Funcionalidade de visualização em desenvolvimento",
                              );
                            }}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="dark-glass dark-border hover:dark-border-hover"
                            onClick={() =>
                              router.push(
                                `/dashboard/courses/${params.courseId}/lessons/${lesson.id}/edit`,
                              )
                            }
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            className="dark-glass dark-border hover:dark-border-hover"
                            onClick={() =>
                              handleDeleteLesson(module.id, lesson.id)
                            }
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="dark-card dark-shadow-sm rounded-lg p-6 text-center">
                    <div className="dark-bg-secondary mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full">
                      <BookOpen className="dark-text-tertiary" size={20} />
                    </div>
                    <h4 className="dark-text-primary mb-2 font-medium">
                      Nenhuma lição neste módulo
                    </h4>
                    <p className="dark-text-tertiary mb-4 text-sm">
                      Adicione lições para organizar o conteúdo do módulo
                    </p>
                    <Button
                      onClick={() => handleAddLesson(module.id)}
                      className="dark-btn-primary"
                      size="sm"
                    >
                      <Plus className="mr-2 h-3 w-3" />
                      Adicionar Primeira Lição
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {modules.length === 0 && (
          <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <BookOpen className="dark-text-tertiary" size={24} />
            </div>
            <h3 className="dark-text-primary mb-2 font-semibold">
              Nenhum módulo criado
            </h3>
            <p className="dark-text-tertiary mb-4 text-sm">
              Comece criando seu primeiro módulo para organizar o conteúdo do
              curso
            </p>
            <Button
              onClick={() => setIsAddingModule(true)}
              className="dark-btn-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Módulo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
