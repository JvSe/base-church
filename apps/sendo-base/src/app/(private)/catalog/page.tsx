"use client";

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
import { useCatalogCourses, useCourseFilters } from "@/src/hooks";
import { Button } from "@base-church/ui/components/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
import { Filter, Search, Target, TrendingUp, Zap } from "lucide-react";

export default function CatalogPage() {
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
    <PageLayout spacing="normal">
      <PageHeader
        title="Catálogo de Cursos"
        description="Explore milhares de cursos e encontre o que você precisa para evoluir"
      >
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
              <Filter size={16} />
              Filtros avançados
            </Button>
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
          </div>
        </div>
      </PageHeader>

      {/* Search and Filters */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-4">
        <div className="flex items-center space-x-4">
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
          <TabsList className="dark-bg-secondary grid h-12 w-full grid-cols-4">
            <TabsTrigger
              value="all"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary"
            >
              Todos ({courses.length})
            </TabsTrigger>
            <TabsTrigger
              value="featured"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary"
            >
              <TrendingUp size={16} className="mr-2" />
              Em Destaque ({featuredCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="enrolled"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary"
            >
              <Zap size={16} className="mr-2" />
              Matriculados ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="recommended"
              className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary"
            >
              <Target size={16} className="mr-2" />
              Recomendados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filteredCourses.length > 0 ? (
              <CourseGrid
                courses={filteredCourses}
                variant="catalog"
                layout={viewMode}
              />
            ) : (
              <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Search className="dark-text-tertiary" size={24} />
                </div>
                <h3 className="dark-text-primary mb-2 font-semibold">
                  {searchQuery
                    ? "Nenhum curso encontrado"
                    : "Nenhum curso disponível"}
                </h3>
                <p className="dark-text-tertiary mb-4 text-sm">
                  {searchQuery
                    ? "Tente ajustar sua busca ou filtros"
                    : "Não há cursos disponíveis no momento"}
                </p>
                <Button
                  className="dark-btn-primary"
                  onClick={() => setSearchQuery("")}
                >
                  {searchQuery ? "Limpar Busca" : "Explorar Cursos"}
                </Button>
              </div>
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
              <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <TrendingUp className="dark-text-tertiary" size={24} />
                </div>
                <h3 className="dark-text-primary mb-2 font-semibold">
                  Nenhum curso em destaque
                </h3>
                <p className="dark-text-tertiary mb-4 text-sm">
                  Não há cursos em destaque no momento
                </p>
                <Button
                  className="dark-btn-primary"
                  onClick={() => setSelectedCategory("all")}
                >
                  Ver Todos os Cursos
                </Button>
              </div>
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
              <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Zap className="dark-text-tertiary" size={24} />
                </div>
                <h3 className="dark-text-primary mb-2 font-semibold">
                  Nenhum curso matriculado
                </h3>
                <p className="dark-text-tertiary mb-4 text-sm">
                  Você ainda não se matriculou em nenhum curso
                </p>
                <Button className="dark-btn-primary">Explorar Cursos</Button>
              </div>
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
              <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
                <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                  <Target className="dark-text-tertiary" size={24} />
                </div>
                <h3 className="dark-text-primary mb-2 font-semibold">
                  Nenhuma recomendação
                </h3>
                <p className="dark-text-tertiary mb-4 text-sm">
                  Não há cursos recomendados no momento
                </p>
                <Button
                  className="dark-btn-primary"
                  onClick={() => setSelectedCategory("all")}
                >
                  Ver Todos os Cursos
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
