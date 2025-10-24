import { getCourses, getUserEnrollments } from "@/src/lib/actions";
import { addPastorPrefix } from "@/src/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "./auth";

export function useCatalogCourses() {
  const { user } = useAuth();

  // Fetch published courses
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses", "published", user?.id],
    queryFn: () =>
      getCourses({ filter: "published", userAdm: user?.role === "ADMIN" }),
    select: (data) => data.courses,
  });

  // Fetch user enrollments
  const { data: enrollmentsData } = useQuery({
    queryKey: ["user-enrollments", user?.id],
    queryFn: () => getUserEnrollments(user!.id),
    select: (data) => data.enrollments,
    enabled: !!user?.id,
  });

  // Transform courses for display
  const courses =
    coursesData?.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.image || null,
      duration: course.duration,
      level: course.level,
      category: course.category,
      instructor:
        addPastorPrefix(course.instructor?.name, course.instructor?.isPastor) ||
        "Instrutor não definido",
      price: course.price || 0,
      rating: course.rating || 0,
      enrolledStudents: course.studentsCount || course._count?.enrollments || 0,
      isEnrolled:
        enrollmentsData?.some(
          (enrollment: any) => enrollment.courseId === course.id,
        ) || false,
      isFeatured: course.isFeatured,
      isPublished: course.isPublished,
      tags: course.tags || [],
      totalLessons: course.totalLessons || 0,
      reviewsCount: course.reviewsCount || 0,
      certificate: course.certificate || false,
    })) || [];

  const featuredCourses = courses.filter(
    (course) => course.isFeatured && course.isPublished,
  );

  const enrolledCourses = courses.filter((course) => course.isEnrolled);

  return {
    courses,
    featuredCourses,
    enrolledCourses,
    isLoading: coursesLoading,
    error: coursesError,
  };
}
