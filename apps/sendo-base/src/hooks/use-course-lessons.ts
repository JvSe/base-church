import { createLesson, deleteLesson, updateLesson } from "@/src/lib/actions";
import { extractYouTubeEmbedId } from "@/src/lib/helpers/youtube";
import type { Lesson, LessonType } from "@/src/lib/types/course.types";
import { useState } from "react";
import { toast } from "sonner";
import { LessonFormData } from "../lib/forms/course-schemas";

/**
 * Hook para gerenciar operações de lições de curso
 *
 * Substituiu lógica duplicada em:
 * - create/page.tsx (~200 linhas)
 * - [courseId]/edit/page.tsx (~200 linhas)
 *
 * @example
 * const { showLessonForm, addLesson, editLesson, deleteLesson } = useCourseLessons(modules, setModules);
 */

type UseCourseLessonsOptions = {
  onLessonChange?: () => void;
};

export function useCourseLessons(
  modules: any[],
  setModules: (modules: any[]) => void,
  options: UseCourseLessonsOptions = {},
) {
  const { onLessonChange } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [showLessonForm, setShowLessonForm] = useState<number | null>(null);
  const [editingLesson, setEditingLesson] = useState<{
    moduleIndex: number;
    lessonIndex: number;
  } | null>(null);

  /**
   * Adiciona uma nova lição a um módulo
   */
  const addLesson = async (
    data: LessonFormData,
    moduleIndex: number,
  ): Promise<{ success: boolean; lesson?: Lesson | null }> => {
    const module = modules[moduleIndex];
    if (!module || !module.id) {
      toast.error("Módulo não encontrado");
      return { success: false, lesson: null };
    }

    // Validar se está tentando adicionar uma atividade que não seja a última lição
    const isQuiz =
      data.type === "OBJECTIVE_QUIZ" || data.type === "SUBJECTIVE_QUIZ";
    if (isQuiz && module.lessons.length > 0) {
      const hasActivity = module.lessons.some((l: any) => l.isActivity);
      if (hasActivity) {
        toast.error(
          "Este módulo já possui uma atividade. Cada módulo pode ter apenas uma atividade como última lição.",
        );
        return { success: false, lesson: null };
      }
    }

    setIsLoading(true);
    const youtubeEmbedId = extractYouTubeEmbedId(data.videoUrl || "");

    try {
      const result = await createLesson(module.id, {
        ...data,
        youtubeEmbedId: youtubeEmbedId || undefined,
        order: module.lessons.length + 1,
        isActivity: isQuiz,
      });

      if (result.success && result.lesson) {
        const newLesson: Lesson = {
          id: result.lesson.id,
          title: data.title,
          description: data.description,
          content: data.content,
          videoUrl: data.videoUrl,
          youtubeEmbedId: youtubeEmbedId || undefined,
          duration: data.duration,
          order: module.lessons.length + 1,
          type: data.type as LessonType,
          isActivity: isQuiz,
          questions: [],
        };

        const updatedModules = [...modules];
        if (updatedModules[moduleIndex]) {
          updatedModules[moduleIndex].lessons.push(newLesson);
          setModules(updatedModules);
        }

        setShowLessonForm(null);
        // Não chama onLessonChange para evitar loops

        if (isQuiz) {
          toast.success("Atividade criada! Agora adicione as questões.");
        } else {
          toast.success("Lição adicionada com sucesso!");
        }

        return { success: true, lesson: newLesson };
      }

      toast.error(result.error || "Erro ao criar lição");
      return { success: false, lesson: null };
    } catch (error) {
      toast.error("Erro ao criar lição");
      return { success: false, lesson: null };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Inicia edição de uma lição
   */
  const startEditLesson = (moduleIndex: number, lessonIndex: number) => {
    setEditingLesson({ moduleIndex, lessonIndex });
  };

  /**
   * Cancela edição de lição
   */
  const cancelEditLesson = () => {
    setEditingLesson(null);
  };

  /**
   * Salva edição de uma lição
   */
  const saveLesson = async (
    data: LessonFormData,
    moduleIndex: number,
    lessonIndex: number,
  ): Promise<boolean> => {
    const lesson = modules[moduleIndex]?.lessons[lessonIndex];
    if (!lesson) {
      toast.error("Lição não encontrada");
      return false;
    }

    const youtubeEmbedId = extractYouTubeEmbedId(data.videoUrl || "");

    setIsLoading(true);
    try {
      const result = await updateLesson(lesson.id, {
        ...data,
        youtubeEmbedId: youtubeEmbedId || "",
        order: lesson.order,
      });

      if (result.success) {
        const updatedModules = [...modules];
        if (updatedModules[moduleIndex]?.lessons[lessonIndex]) {
          updatedModules[moduleIndex].lessons[lessonIndex] = {
            ...updatedModules[moduleIndex].lessons[lessonIndex],
            title: data.title,
            description: data.description,
            content: data.content,
            videoUrl: data.videoUrl,
            youtubeEmbedId: youtubeEmbedId || "",
            duration: data.duration,
            type: data.type as LessonType,
          };
          setModules(updatedModules);
        }

        setEditingLesson(null);
        // Não chama onLessonChange para evitar loops
        toast.success("Lição atualizada com sucesso!");
        return true;
      }

      toast.error(result.error || "Erro ao atualizar lição");
      return false;
    } catch (error) {
      toast.error("Erro ao atualizar lição");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Remove uma lição
   */
  const removeLesson = async (
    lessonId: string,
    moduleIndex: number,
    lessonIndex: number,
  ): Promise<boolean> => {
    if (!confirm("Tem certeza que deseja excluir esta lição?")) {
      return false;
    }

    try {
      const result = await deleteLesson(lessonId);
      if (result.success) {
        const updatedModules = [...modules];
        if (updatedModules[moduleIndex]) {
          updatedModules[moduleIndex].lessons = updatedModules[
            moduleIndex
          ].lessons.filter((_: any, i: number) => i !== lessonIndex);
          setModules(updatedModules);
        }

        // Não chama onLessonChange para evitar loops
        toast.success(result.message);
        return true;
      }

      toast.error(result.error);
      return false;
    } catch (error) {
      toast.error("Erro ao excluir lição");
      return false;
    }
  };

  /**
   * Remove lição por índice (para modo create onde não há ID ainda)
   */
  const removeLessonByIndex = (moduleIndex: number, lessonIndex: number) => {
    const updatedModules = [...modules];
    if (updatedModules[moduleIndex]) {
      updatedModules[moduleIndex].lessons = updatedModules[
        moduleIndex
      ].lessons.filter((_: any, i: number) => i !== lessonIndex);
      setModules(updatedModules);
      toast.success("Lição removida!");
    }
  };

  return {
    isLoading,
    showLessonForm,
    setShowLessonForm,
    editingLesson,
    startEditLesson,
    cancelEditLesson,
    addLesson,
    saveLesson,
    removeLesson,
    removeLessonByIndex,
  };
}
