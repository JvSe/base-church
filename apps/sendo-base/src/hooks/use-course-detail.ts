"use client";

import { getCourseById, getUserEnrollmentStatus } from "@/src/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./auth";

type UseCourseDetailOptions = {
  courseId: string;
};

export function useCourseDetail({ courseId }: UseCourseDetailOptions) {
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

  const course = courseData?.course;
  const enrollment = enrollmentData?.enrollment;
  const modules = course?.modules || [];
  const reviews = course?.reviews || [];

  const enrollmentStatus = enrollment?.status || "none";
  const isEnrolled =
    enrollmentStatus === "pending" || enrollmentStatus === "approved";

  return {
    course,
    enrollment,
    modules,
    reviews,
    enrollmentStatus,
    isEnrolled,
    isLoading: isCourseLoading || isEnrollmentLoading,
    error: courseError,
    refetchEnrollment,
  };
}
