import { getUserEnrollments } from "@/src/lib/actions";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./auth";

export function useMyEnrollments() {
  const { user } = useAuth();

  const {
    data: enrollmentsData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["all-user-enrollments", user?.id],
    queryFn: () => getUserEnrollments(user?.id || ""),
    enabled: !!user?.id,
    select: (data) => data.enrollments,
  });

  // Transform enrollments to course format
  const transformEnrollment = (enrollment: any) => ({
    id: enrollment.course.id,
    title: enrollment.course.title,
    description: enrollment.course.description,
    image: enrollment.course.image || "/api/placeholder/300/200",
    duration: enrollment.course.duration,
    level: enrollment.course.level,
    category: enrollment.course.category,
    instructor: enrollment.course.instructor?.name || "Instrutor não definido",
    price: enrollment.course.price || 0,
    rating: enrollment.course.rating || 0,
    enrolledStudents: enrollment.course._count?.enrollments || 0,
    isEnrolled: true,
    isFeatured: enrollment.course.isFeatured,
    tags: enrollment.course.tags || [],
    progress: Math.round(enrollment.progress || 0),
    enrollmentId: enrollment.id,
    enrolledAt: enrollment.enrolledAt,
    completedAt: enrollment.completedAt,
    lastAccessedAt: enrollment.lastAccessedAt,
    status: enrollment.status,
  });

  const allEnrollments = enrollmentsData?.map(transformEnrollment) || [];

  const approvedEnrollments = allEnrollments.filter(
    (e) => e.status === "approved",
  );

  const pendingEnrollments = allEnrollments.filter(
    (e) => e.status === "pending",
  );

  const inProgressCourses = approvedEnrollments.filter(
    (c) => c.progress > 0 && c.progress < 100,
  );

  const completedCourses = approvedEnrollments.filter(
    (c) => c.progress === 100,
  );

  const averageProgress =
    approvedEnrollments.length > 0
      ? Math.round(
          approvedEnrollments.reduce((acc, c) => acc + c.progress, 0) /
            approvedEnrollments.length,
        )
      : 0;

  return {
    allEnrollments,
    approvedEnrollments,
    pendingEnrollments,
    inProgressCourses,
    completedCourses,
    averageProgress,
    isLoading,
    error,
    refetch,
  };
}
