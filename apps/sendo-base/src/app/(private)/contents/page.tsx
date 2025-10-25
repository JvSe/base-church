"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import {
  CourseGrid,
  CourseSearchBar,
  StatsRow,
  ViewModeToggle,
} from "@/src/components/courses";
import {
  useCourseFilters,
  useMyEnrollments,
  usePageTitle,
  useResponsive,
} from "@/src/hooks";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
import { Filter, Search } from "lucide-react";

export default function ContentsPage() {
  usePageTitle("Meus Cursos");

  const {
    approvedEnrollments,
    pendingEnrollments,
    inProgressCourses,
    completedCourses,
    averageProgress,
    isLoading,
    error,
  } = useMyEnrollments();

  const {
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    filteredCourses,
  } = useCourseFilters(approvedEnrollments);

  const { isMobile } = useResponsive();

  const filteredPending = useCourseFilters(pendingEnrollments, {
    searchFields: ["title", "description", "instructor", "category", "tags"],
  }).filteredCourses;

  const filteredInProgress = filteredCourses.filter(
    (c) => c.progress > 0 && c.progress < 100,
  );

  const filteredCompleted = filteredCourses.filter((c) => c.progress === 100);

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

  const stats = [
    {
      value: approvedEnrollments.length,
      label: "Cursos Matriculados",
    },
    {
      value: inProgressCourses.length,
      label: "Em Andamento",
    },
    {
      value: completedCourses.length,
      label: "Concluídos",
    },
    {
      value: `${averageProgress}%`,
      label: "Progresso Médio",
    },
  ];

  return (
    <PageLayout>
      <PageHeader
        title="Biblioteca de Conteúdos"
        description="Continue de onde parou e acompanhe seu progresso de aprendizado ministerial"
        actions={
          isMobile
            ? undefined
            : [
                {
                  label: "Filtrar",
                  icon: Filter,
                  className: "dark-glass dark-border hover:dark-border-hover",
                },
              ]
        }
      >
        <div className="hidden items-center justify-end md:flex">
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>

        <StatsRow stats={stats} />
      </PageHeader>

      {/* Search */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-4">
        <CourseSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Buscar por cursos, aulas ou instrutores..."
        />
      </div>

      {/* Tabs */}
      <div className="dark-shadow-sm rounded-xl p-1">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="dark-bg-secondary mb-10 grid h-12 w-full grid-cols-2 gap-2 md:mb-0 md:grid-cols-4">
            <TabsTrigger
              value="all"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
            >
              Todos ({approvedEnrollments.length})
            </TabsTrigger>
            <TabsTrigger
              value="in-progress"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
            >
              Em Andamento ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
            >
              Concluídos ({completedCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending-approval"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
            >
              Aguardando Autorização ({pendingEnrollments.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredCourses.length > 0 ? (
              <CourseGrid
                courses={filteredCourses}
                variant="contents"
                layout={viewMode}
              />
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
            {filteredInProgress.length > 0 ? (
              <CourseGrid
                courses={filteredInProgress}
                variant="contents"
                layout="grid"
              />
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
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {filteredCompleted.length > 0 ? (
              <CourseGrid
                courses={filteredCompleted}
                variant="contents"
                layout="grid"
              />
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
            )}
          </TabsContent>

          <TabsContent value="pending-approval" className="mt-6">
            {filteredPending.length > 0 ? (
              <CourseGrid
                courses={filteredPending}
                variant="contents"
                layout={viewMode}
                disabled={true}
              />
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
