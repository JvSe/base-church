"use client";

import { useAuth } from "@/src/hooks";
import {
  generateCertificateForCompletedCourse,
  getLessonWithProgress,
  saveQuizAnswers,
  updateLessonProgress,
} from "@/src/lib/actions/course";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type UseLessonProgressOptions = {
  courseId: string;
  lessonId: string;
};

export function useLessonProgress({
  courseId,
  lessonId,
}: UseLessonProgressOptions) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [showCertificateNotification, setShowCertificateNotification] =
    useState(false);

  // Buscar dados da lição com progresso
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
    refetchOnWindowFocus: true,
  });

  // Mutation para atualizar progresso
  const updateProgressMutation = useMutation({
    mutationFn: async (data: { isCompleted?: boolean; watchedAt?: Date }) => {
      if (!user?.id || !lessonId) {
        throw new Error("User ID or Lesson ID not available");
      }
      return await updateLessonProgress(user.id, lessonId, data);
    },
    onSuccess: async (result) => {
      if (result.success) {
        await queryClient.invalidateQueries({
          queryKey: ["lesson", lessonId, user?.id],
        });

        const updatedLesson = lessonData?.lesson;
        const updatedCourse = lessonData?.course;

        // Verificar se é a última lição
        const allLessons =
          updatedCourse?.modules?.flatMap((module: any) =>
            module.lessons.map((lesson: any) => ({
              ...lesson,
              moduleTitle: module.title,
            })),
          ) || [];

        const currentLessonIndex = allLessons.findIndex(
          (l: any) => l.id === updatedLesson?.id,
        );

        const isLastLesson = currentLessonIndex === allLessons.length - 1;

        const completedLessons = allLessons.filter(
          (l: any) => l.isCompleted,
        ).length;
        const totalLessons = allLessons.length;
        const courseProgress =
          totalLessons > 0
            ? Math.round((completedLessons / totalLessons) * 100)
            : 0;
        const isCourseCompleted = courseProgress === 100;

        // Gerar certificado se curso foi completado
        if (
          isLastLesson &&
          isCourseCompleted &&
          updatedCourse?.certificateTemplate &&
          user?.id
        ) {
          try {
            await generateCertificateForCompletedCourse(user.id, courseId);
            setShowCertificateNotification(true);
            setTimeout(() => setShowCertificateNotification(false), 5000);
          } catch (error) {
            console.error("Erro ao gerar certificado:", error);
          }
        }

        // Navegar para próxima lição
        if (!isLastLesson) {
          const nextAvailableLesson = allLessons
            .slice(currentLessonIndex + 1)
            .find((l: any) => !l.isLocked);

          if (nextAvailableLesson) {
            setTimeout(() => {
              router.push(
                `/contents/course/${courseId}/lessons/${nextAvailableLesson.id}`,
              );
            }, 1500);
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

  const handleCompleteLesson = async () => {
    if (!user?.id || !lessonData?.lesson || isUpdatingProgress) return;

    setIsUpdatingProgress(true);
    setShowSuccessFeedback(false);

    try {
      await updateProgressMutation.mutateAsync({
        isCompleted: !lessonData.lesson.isCompleted,
        watchedAt: new Date(),
      });
    } catch (error) {
      console.error("Error updating lesson progress:", error);
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  const handleCompleteQuiz = async (
    answers: Array<{
      questionId: string;
      selectedOptionId: string;
    }>,
  ) => {
    if (!user?.id || !lessonData?.lesson || isUpdatingProgress) return;

    setIsUpdatingProgress(true);
    setShowSuccessFeedback(false);

    try {
      // Salvar respostas do quiz
      const quizResult = await saveQuizAnswers(
        user.id,
        lessonData.lesson.id,
        answers,
      );

      if (!quizResult.success) {
        throw new Error(quizResult.error || "Erro ao salvar respostas");
      }

      // Se passou no quiz (>= 70%), marcar lição como concluída
      if (quizResult.data?.passed) {
        await updateProgressMutation.mutateAsync({
          isCompleted: true,
          watchedAt: new Date(),
        });
      }

      return quizResult.data;
    } catch (error) {
      console.error("Error completing quiz:", error);
      throw error;
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  return {
    lesson: lessonData?.lesson,
    course: lessonData?.course,
    certificate: lessonData?.certificate,
    isLoading,
    error,
    isUpdatingProgress,
    showSuccessFeedback,
    showCertificateNotification,
    handleCompleteLesson,
    handleCompleteQuiz,
    refetch,
  };
}
