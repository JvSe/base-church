"use client";

import { CourseCard } from "@/src/components/common/data-display/course-card";
import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { useAuth } from "@/src/hooks";

import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { getUserEnrollments } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
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
      <PageLayout>
        <LoadingState
          icon={Search}
          title="Carregando seus conteúdos..."
          description="Buscando seus cursos e progresso de aprendizado"
        />
      </PageLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <PageLayout>
        <ErrorState
          icon={Search}
          title="Erro ao carregar conteúdos"
          description="Não foi possível carregar seus cursos. Tente novamente."
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Biblioteca de Conteúdos"
        description="Continue de onde parou e acompanhe seu progresso de aprendizado ministerial"
        actions={[
          {
            label: "Filtrar",
            icon: Filter,
            className: "dark-glass dark-border hover:dark-border-hover",
          },
        ]}
      >
        {/* View Mode Toggle */}
        <div className="flex items-center justify-end">
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

        {/* Progress Stats */}
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-4">
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
              {courses.filter((c) => c.progress > 0 && c.progress < 100).length}
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
      </PageHeader>

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
              {courses.filter((c) => c.progress > 0 && c.progress < 100).length}
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
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="grid"
                      variant="contents"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnrollments.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="list"
                      variant="contents"
                    />
                  ))}
                </div>
              )
            ) : (
              <EmptyState
                icon={Search}
                title={
                  searchQuery
                    ? "Nenhum curso encontrado"
                    : "Nenhum curso matriculado"
                }
                description={
                  searchQuery
                    ? "Tente ajustar sua busca ou explore nosso catálogo de cursos"
                    : "Comece sua jornada de aprendizado explorando nossos cursos disponíveis"
                }
                action={{
                  label: searchQuery ? "Limpar Busca" : "Explorar Cursos",
                  onClick: searchQuery
                    ? () => setSearchQuery("")
                    : () => (window.location.href = "/catalog"),
                }}
              />
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
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="grid"
                      variant="contents"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="Nenhum curso em andamento"
                  description="Comece um curso para vê-lo aparecer aqui"
                  action={{
                    label: "Explorar Cursos",
                    onClick: () => (window.location.href = "/catalog"),
                  }}
                />
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
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="grid"
                      variant="contents"
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon={Search}
                  title="Nenhum curso concluído"
                  description="Complete seus cursos para vê-los aparecer aqui"
                  action={{
                    label: "Continuar Aprendendo",
                    onClick: () => (window.location.href = "/contents"),
                  }}
                />
              );
            })()}
          </TabsContent>

          <TabsContent value="pending-approval" className="mt-6">
            {filteredPendingCourses.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredPendingCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="grid"
                      variant="contents"
                      disabled={course.status === "pending"}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPendingCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="list"
                      variant="contents"
                      disabled={course.status === "pending"}
                    />
                  ))}
                </div>
              )
            ) : (
              <EmptyState
                icon={Search}
                title="Nenhuma solicitação pendente"
                description="Você não possui cursos aguardando aprovação dos líderes"
                action={{
                  label: "Explorar Cursos",
                  onClick: () => (window.location.href = "/catalog"),
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
