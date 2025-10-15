"use client";

import { useAuth } from "@/src/hooks";
import {
  getCourseById,
  getUserEnrollmentStatus,
  getUserProgress,
} from "@/src/lib/actions";
import { useQuery } from "@tanstack/react-query";

type UseCourseDataOptions = {
  courseId: string;
};

export function useCourseData({ courseId }: UseCourseDataOptions) {
  const { user } = useAuth();

  // Buscar dados do curso
  const {
    data: courseData,
    isLoading: isCourseLoading,
    error: courseError,
  } = useQuery({
    queryKey: ["course", courseId],
    queryFn: () => getCourseById(courseId),
    enabled: !!courseId,
  });

  // Buscar status da matrícula
  const {
    data: enrollmentData,
    isLoading: isEnrollmentLoading,
    refetch: refetchEnrollment,
  } = useQuery({
    queryKey: ["enrollment", courseId, user?.id],
    queryFn: () => getUserEnrollmentStatus(courseId, user!.id),
    enabled: !!courseId && !!user?.id,
  });

  // Buscar progresso
  const {
    data: progressData,
    isLoading: isProgressLoading,
    refetch: refetchProgress,
  } = useQuery({
    queryKey: ["progress", courseId, user?.id],
    queryFn: () => getUserProgress(user!.id),
    enabled: !!courseId && !!user?.id,
  });

  const course = courseData?.course;
  const enrollment = enrollmentData?.enrollment;
  const progress = progressData?.progress || [];

  // Calcular IDs das lições completadas
  const completedLessonIds = progress
    .filter((p: any) => p.isCompleted)
    .map((p: any) => p.lessonId);

  const isEnrolled = enrollment?.status === "approved";
  const enrollmentStatus = enrollment?.status;

  return {
    course,
    enrollment,
    progress,
    completedLessonIds,
    isEnrolled,
    enrollmentStatus,
    isLoading: isCourseLoading || isEnrollmentLoading || isProgressLoading,
    error: courseError,
    refetchEnrollment,
    refetchProgress,
  };
}
