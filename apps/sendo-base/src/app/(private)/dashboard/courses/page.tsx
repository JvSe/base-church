import { getCourses } from "@/src/lib/actions";
import type { CourseLevel, CourseStatus } from "@/src/lib/types/index";
import { Button } from "@base-church/ui/components/button";
import { Award, BookOpen, Plus, Search, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { CoursesListClient } from "./components/courses-list-client";

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
          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Total de Cursos
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {totalCourses}
                </p>
              </div>
              <div className="dark-primary-subtle-bg rounded-xl p-3">
                <BookOpen className="dark-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {totalCourses} cursos criados
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Cursos Publicados
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {publishedCourses}
                </p>
              </div>
              <div className="dark-success-bg rounded-xl p-3">
                <TrendingUp className="dark-success" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {totalCourses > 0
                  ? Math.round((publishedCourses / totalCourses) * 100)
                  : 0}
                % publicados
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Total de Inscrições
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {totalStudents}
                </p>
              </div>
              <div className="dark-secondary-subtle-bg rounded-xl p-3">
                <Users className="dark-secondary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {totalCourses > 0
                  ? Math.round(totalStudents / totalCourses)
                  : 0}{" "}
                por curso
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Conclusões
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {totalCompletions}
                </p>
              </div>
              <div className="dark-warning-bg rounded-xl p-3">
                <Award className="dark-warning" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {totalStudents > 0
                  ? Math.round((totalCompletions / totalStudents) * 100)
                  : 0}
                % taxa
              </span>
            </div>
          </div>
        </div>

        {/* Client-side interactive components */}
        <CoursesListClient courses={courses} />
      </div>
    </div>
  );
}
