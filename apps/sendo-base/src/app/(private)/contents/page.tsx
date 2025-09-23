"use client";

import { DashboardCourseCard } from "@/src/components/dashboard-course-card";
import { DashboardCourseListCard } from "@/src/components/dashboard-course-list-card";
import { useAuth } from "@/src/hooks";

import { getUserEnrollments } from "@/src/lib/actions";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { useQuery } from "@tanstack/react-query";
import { Filter, Grid, List, Search } from "lucide-react";
import { useState } from "react";

export default function ContentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();

  console.log("user", user);

  const {
    data: allEnrollmentsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["all-user-enrollments", user?.id],
    queryFn: () => getUserEnrollments(user?.id || ""),
    enabled: !!user?.id,
    select: (data) => data.enrollments,
  });

  // Transform enrollments to course format for compatibility with existing components
  const courses =
    allEnrollmentsData
      ?.filter((enrollment: any) => enrollment.status === "approved")
      .map((enrollment: any) => ({
        id: enrollment.course.id,
        title: enrollment.course.title,
        description: enrollment.course.description,
        image: enrollment.course.image || "/api/placeholder/300/200",
        duration: enrollment.course.duration,
        level: enrollment.course.level,
        category: enrollment.course.category,
        instructor:
          enrollment.course.instructor?.name || "Instrutor não definido",
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
      })) || [];

  const filteredEnrollments = courses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.description?.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower) ||
      course.category?.toLowerCase().includes(searchLower) ||
      course.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  });

  // Separar matrículas pendentes para a aba específica
  const pendingEnrollments =
    allEnrollmentsData?.filter(
      (enrollment: any) => enrollment.status === "pending",
    ) || [];

  // Transformar matrículas pendentes para o formato de curso
  const pendingCourses =
    pendingEnrollments.map((enrollment: any) => ({
      id: enrollment.course.id,
      title: enrollment.course.title,
      description: enrollment.course.description,
      image: enrollment.course.image || "/api/placeholder/300/200",
      duration: enrollment.course.duration,
      level: enrollment.course.level,
      category: enrollment.course.category,
      instructor:
        enrollment.course.instructor?.name || "Instrutor não definido",
      price: enrollment.course.price || 0,
      rating: enrollment.course.rating || 0,
      enrolledStudents: enrollment.course._count?.enrollments || 0,
      isEnrolled: true,
      isFeatured: enrollment.course.isFeatured,
      tags: enrollment.course.tags || [],
      progress: 0, // Sempre 0 para cursos pendentes
      enrollmentId: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      completedAt: null,
      lastAccessedAt: null,
      status: "pending", // Adicionar status para identificar
    })) || [];

  const filteredPendingCourses = pendingCourses.filter((course) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      course.title.toLowerCase().includes(searchLower) ||
      course.description?.toLowerCase().includes(searchLower) ||
      course.instructor.toLowerCase().includes(searchLower) ||
      course.category?.toLowerCase().includes(searchLower) ||
      course.tags.some((tag: string) => tag.toLowerCase().includes(searchLower))
    );
  });

  // Loading state
  if (isLoading) {
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
              Carregando seus conteúdos...
            </h1>
            <p className="dark-text-secondary">
              Buscando seus cursos e progresso de aprendizado
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
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
              Erro ao carregar conteúdos
            </h1>
            <p className="dark-text-secondary mb-4">
              Não foi possível carregar seus cursos. Tente novamente.
            </p>
            <Button
              className="dark-btn-primary"
              onClick={() => window.location.reload()}
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

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Biblioteca de Conteúdos
              </h1>
              <p className="dark-text-secondary">
                Continue de onde parou e acompanhe seu progresso de aprendizado
                ministerial
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
                <Filter size={16} />
                Filtrar
              </Button>
              <div className="dark-bg-secondary flex items-center rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "dark-btn-primary"
                      : "dark-text-secondary hover:dark-text-primary"
                  }
                >
                  <Grid size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "dark-btn-primary"
                      : "dark-text-secondary hover:dark-text-primary"
                  }
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* Progress Stats */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {courses.length}
              </div>
              <div className="dark-text-tertiary text-sm">
                Cursos Matriculados
              </div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {
                  courses.filter((c) => c.progress > 0 && c.progress < 100)
                    .length
                }
              </div>
              <div className="dark-text-tertiary text-sm">Em Andamento</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {courses.filter((c) => c.progress === 100).length}
              </div>
              <div className="dark-text-tertiary text-sm">Concluídos</div>
            </div>

            <div className="dark-bg-secondary rounded-lg p-4 text-center">
              <div className="dark-text-primary mb-1 text-2xl font-bold">
                {courses.length > 0
                  ? Math.round(
                      courses.reduce((acc, c) => acc + c.progress, 0) /
                        courses.length,
                    )
                  : 0}
                %
              </div>
              <div className="dark-text-tertiary text-sm">Progresso Médio</div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-4">
          <div className="relative">
            <Search
              className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
              size={20}
            />
            <Input
              placeholder="Buscar por cursos, aulas ou instrutores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dark-input h-12 pl-12 text-base"
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="dark-shadow-sm rounded-xl p-1">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="dark-bg-secondary grid h-12 w-full grid-cols-4">
              <TabsTrigger
                value="all"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                Todos ({courses.length})
              </TabsTrigger>
              <TabsTrigger
                value="in-progress"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                Em Andamento (
                {
                  courses.filter((c) => c.progress > 0 && c.progress < 100)
                    .length
                }
                )
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                Concluídos ({courses.filter((c) => c.progress === 100).length})
              </TabsTrigger>
              <TabsTrigger
                value="pending-approval"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                Aguardando Autorização ({pendingCourses.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {filteredEnrollments.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEnrollments.map((course) => (
                      <DashboardCourseCard
                        key={course.id}
                        course={course}
                        variant="contents"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredEnrollments.map((course) => (
                      <DashboardCourseListCard
                        key={course.id}
                        course={course}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                  <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Search className="dark-text-tertiary" size={24} />
                  </div>
                  <h3 className="dark-text-primary mb-2 font-semibold">
                    {searchQuery
                      ? "Nenhum curso encontrado"
                      : "Nenhum curso matriculado"}
                  </h3>
                  <p className="dark-text-tertiary mb-4 text-sm">
                    {searchQuery
                      ? "Tente ajustar sua busca ou explore nosso catálogo de cursos"
                      : "Comece sua jornada de aprendizado explorando nossos cursos disponíveis"}
                  </p>
                  <Button className="dark-btn-primary">
                    {searchQuery ? "Limpar Busca" : "Explorar Cursos"}
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="in-progress" className="mt-6">
              {(() => {
                const inProgressCourses = filteredEnrollments.filter(
                  (e) => e.progress > 0 && e.progress < 100,
                );
                return inProgressCourses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {inProgressCourses.map((course) => (
                      <DashboardCourseCard
                        key={course.id}
                        course={course}
                        variant="contents"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                    <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <Search className="dark-text-tertiary" size={24} />
                    </div>
                    <h3 className="dark-text-primary mb-2 font-semibold">
                      Nenhum curso em andamento
                    </h3>
                    <p className="dark-text-tertiary mb-4 text-sm">
                      Comece um curso para vê-lo aparecer aqui
                    </p>
                    <Button className="dark-btn-primary">
                      Explorar Cursos
                    </Button>
                  </div>
                );
              })()}
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              {(() => {
                const completedCourses = filteredEnrollments.filter(
                  (c) => c.progress === 100,
                );
                return completedCourses.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {completedCourses.map((course) => (
                      <DashboardCourseCard
                        key={course.id}
                        course={course}
                        variant="contents"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                    <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                      <Search className="dark-text-tertiary" size={24} />
                    </div>
                    <h3 className="dark-text-primary mb-2 font-semibold">
                      Nenhum curso concluído
                    </h3>
                    <p className="dark-text-tertiary mb-4 text-sm">
                      Complete seus cursos para vê-los aparecer aqui
                    </p>
                    <Button className="dark-btn-primary">
                      Continuar Aprendendo
                    </Button>
                  </div>
                );
              })()}
            </TabsContent>

            <TabsContent value="pending-approval" className="mt-6">
              {filteredPendingCourses.length > 0 ? (
                viewMode === "grid" ? (
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPendingCourses.map((course) => (
                      <DashboardCourseCard
                        key={course.id}
                        course={course}
                        variant="contents"
                        disabled={course.status === "pending"}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredPendingCourses.map((course) => (
                      <DashboardCourseListCard
                        key={course.id}
                        course={course}
                        disabled={course.status === "pending"}
                      />
                    ))}
                  </div>
                )
              ) : (
                <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                  <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <Search className="dark-text-tertiary" size={24} />
                  </div>
                  <h3 className="dark-text-primary mb-2 font-semibold">
                    Nenhuma solicitação pendente
                  </h3>
                  <p className="dark-text-tertiary mb-4 text-sm">
                    Você não possui cursos aguardando aprovação dos líderes
                  </p>
                  <Button className="dark-btn-primary">Explorar Cursos</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
