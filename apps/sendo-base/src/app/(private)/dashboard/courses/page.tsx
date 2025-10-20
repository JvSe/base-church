import { StatsCard } from "@/src/components/common/data-display/stats-card";
import { getCourses } from "@/src/lib/actions";
import { getStatsIconConfig } from "@/src/lib/helpers/course.helper";
import type { CourseLevel, CourseStatus } from "@/src/lib/types/index";
import { Button } from "@base-church/ui/components/button";
import { Plus, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CoursesListClient } from "./components/courses-list-client";

export const metadata: Metadata = {
  title: "Gerenciar Cursos",
};

type DashboardCourse = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: CourseLevel;
  status: CourseStatus;
  studentsEnrolled: number;
  studentsCompleted: number;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  category: string;
  tags: string[];
};

export default async function CoursesPage() {
  // Fetch courses no servidor
  const result = await getCourses({ filter: "all" });

  // Early return para erro
  if (!result.success || !result.courses) {
    return (
      <div className="dark-bg-primary min-h-screen">
        <div className="fixed inset-0 opacity-3">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
        </div>
        <div className="relative mx-auto max-w-7xl space-y-6 p-6">
          <div className="dark-glass dark-shadow-md rounded-2xl p-8 text-center">
            <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
              <Search className="dark-text-tertiary" size={32} />
            </div>
            <h1 className="dark-text-primary mb-2 text-2xl font-bold">
              Erro ao carregar cursos
            </h1>
            <p className="dark-text-secondary mb-4">
              Não foi possível carregar os cursos. Tente novamente.
            </p>
            <Link href="/dashboard/courses">
              <Button className="dark-btn-primary">Tentar Novamente</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Transformar dados para o formato esperado
  const courses: DashboardCourse[] = result.courses.map((course) => ({
    id: course.id,
    title: course.title,
    description: course.description || "",
    instructor: course.instructor?.name || "Instrutor não definido",
    duration: course.duration || 0,
    level: (course.level || "beginner") as CourseLevel,
    status: (course.isPublished ? "published" : "draft") as CourseStatus,
    studentsEnrolled: course._count?.enrollments || 0,
    studentsCompleted: 0, // TODO: Implementar contagem de completados
    averageRating: course.rating || 0,
    totalRatings: course.reviewsCount || 0,
    createdAt: new Date(course.createdAt),
    updatedAt: new Date(course.updatedAt),
    price: course.price || 0,
    category: course.category || "",
    tags: course.tags || [],
  }));

  // Calcular estatísticas
  const totalCourses = courses.length;
  const publishedCourses = courses.filter(
    (c) => c.status === "published",
  ).length;
  const totalStudents = courses.reduce((sum, c) => sum + c.studentsEnrolled, 0);
  const totalCompletions = courses.reduce(
    (sum, c) => sum + c.studentsCompleted,
    0,
  );

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Gestão de Cursos 📚
              </h1>
              <p className="dark-text-secondary">
                Gerencie seus cursos e acompanhe o desempenho
              </p>
            </div>
            <Link href="/dashboard/courses/create">
              <Button variant="success">
                <Plus className="mr-2 h-4 w-4" />
                Criar Curso Completo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            label="Total de Cursos"
            value={totalCourses}
            iconConfig={getStatsIconConfig("courses")}
            trend={{
              value: `${totalCourses} cursos criados`,
              isPositive: true,
            }}
          />

          <StatsCard
            label="Cursos Publicados"
            value={publishedCourses}
            iconConfig={getStatsIconConfig("published")}
            trend={{
              value: `${totalCourses > 0 ? Math.round((publishedCourses / totalCourses) * 100) : 0}% publicados`,
              isPositive: true,
            }}
          />

          <StatsCard
            label="Total de Inscrições"
            value={totalStudents}
            iconConfig={getStatsIconConfig("students")}
            trend={{
              value: `${totalCourses > 0 ? Math.round(totalStudents / totalCourses) : 0} por curso`,
              isPositive: true,
            }}
          />

          <StatsCard
            label="Conclusões"
            value={totalCompletions}
            iconConfig={getStatsIconConfig("completions")}
            trend={{
              value: `${totalStudents > 0 ? Math.round((totalCompletions / totalStudents) * 100) : 0}% taxa`,
              isPositive: true,
            }}
          />
        </div>

        {/* Client-side interactive components */}
        <CoursesListClient courses={courses} />
      </div>
    </div>
  );
}
