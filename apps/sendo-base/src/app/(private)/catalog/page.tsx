"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import {
  CourseFilters,
  CourseGrid,
  CourseSearchBar,
  ViewModeToggle,
} from "@/src/components/courses";
import {
  useCatalogCourses,
  useCourseFilters,
  usePageTitle,
  useResponsive,
} from "@/src/hooks";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
import { Search, Target, TrendingUp, Zap } from "lucide-react";

export default function CatalogPage() {
  usePageTitle("Catálogo de Cursos");

  const { courses, featuredCourses, enrolledCourses, isLoading, error } =
    useCatalogCourses();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    viewMode,
    setViewMode,
    filteredCourses,
  } = useCourseFilters(courses);

  const { isMobile } = useResponsive();

  // Loading state
  if (isLoading) {
    return (
      <PageLayout>
        <LoadingState
          icon={Search}
          title="Carregando catálogo..."
          description="Buscando cursos disponíveis para você"
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
          title="Erro ao carregar catálogo"
          description="Não foi possível carregar os cursos. Tente novamente."
          onRetry={() => window.location.reload()}
        />
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <PageHeader
        title="Catálogo de Cursos"
        description="Explore milhares de cursos e encontre o que você precisa para evoluir"
      />

      {/* Search and Filters */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <CourseSearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Buscar por cursos, instrutores ou temas ministeriais..."
          />
          <CourseFilters
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            selectedLevel={selectedLevel}
            onLevelChange={setSelectedLevel}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="dark-shadow-sm rounded-xl p-1">
        <Tabs defaultValue="all" className="w-full">
          <div>
            <TabsList className="dark-bg-secondary mb-10 grid h-12 w-full grid-cols-2 gap-2 md:mb-0 md:grid-cols-4">
              <TabsTrigger
                value="all"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
              >
                Todos ({courses.length})
              </TabsTrigger>
              <TabsTrigger
                value="featured"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
              >
                <TrendingUp size={16} className="mr-2" />
                Em Destaque ({featuredCourses.length})
              </TabsTrigger>
              <TabsTrigger
                value="enrolled"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
              >
                <Zap size={16} className="mr-2" />
                Matriculados ({enrolledCourses.length})
              </TabsTrigger>
              <TabsTrigger
                value="recommended"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary p-2 text-sm"
              >
                <Target size={16} className="mr-2" />
                Recomendados
              </TabsTrigger>
            </TabsList>
            <div className="mt-2 hidden items-center justify-end md:flex">
              <ViewModeToggle mode={viewMode} onChange={setViewMode} />
            </div>
          </div>

          <TabsContent value="all" className="mt-6">
            {filteredCourses.length > 0 ? (
              <CourseGrid
                courses={filteredCourses}
                variant="catalog"
                layout={viewMode}
              />
            ) : (
              <EmptyState
                icon={Search}
                title={
                  searchQuery
                    ? "Nenhum curso encontrado"
                    : "Nenhum curso disponível"
                }
                description={
                  searchQuery
                    ? "Tente ajustar sua busca ou filtros"
                    : "Não há cursos disponíveis no momento"
                }
                action={{
                  label: searchQuery ? "Limpar Busca" : "Explorar Cursos",
                  onClick: searchQuery
                    ? () => setSearchQuery("")
                    : () => window.location.reload(),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="featured" className="mt-6">
            {featuredCourses.length > 0 ? (
              <CourseGrid
                courses={featuredCourses}
                variant="catalog"
                layout="grid"
              />
            ) : (
              <EmptyState
                icon={TrendingUp}
                title="Nenhum curso em destaque"
                description="Não há cursos em destaque no momento"
                action={{
                  label: "Ver Todos os Cursos",
                  onClick: () => setSelectedCategory("all"),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="mt-6">
            {enrolledCourses.length > 0 ? (
              <CourseGrid
                courses={enrolledCourses}
                variant="catalog"
                layout="grid"
              />
            ) : (
              <EmptyState
                icon={Zap}
                title="Nenhum curso matriculado"
                description="Você ainda não se matriculou em nenhum curso"
                action={{
                  label: "Explorar Cursos",
                  onClick: () => window.location.reload(),
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="recommended" className="mt-6">
            {filteredCourses.length > 0 ? (
              <CourseGrid
                courses={filteredCourses.slice(0, 6)}
                variant="catalog"
                layout="grid"
              />
            ) : (
              <EmptyState
                icon={Target}
                title="Nenhuma recomendação"
                description="Não há cursos recomendados no momento"
                action={{
                  label: "Ver Todos os Cursos",
                  onClick: () => setSelectedCategory("all"),
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
