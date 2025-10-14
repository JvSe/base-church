"use client";

import { CourseCard } from "@/src/components/common/data-display/course-card";
import { ErrorState } from "@/src/components/common/feedback/error-state";
import { LoadingState } from "@/src/components/common/feedback/loading-state";
import { PageHeader } from "@/src/components/common/layout/page-header";
import { PageLayout } from "@/src/components/common/layout/page-layout";
import { useAuth } from "@/src/hooks";
import { getCourses, getUserEnrollments } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@base-church/ui/components/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@base-church/ui/components/tabs";
import { useQuery } from "@tanstack/react-query";
import {
  Database,
  Filter,
  Grid,
  List,
  Palette,
  Search,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function CatalogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Fetch courses from database (apenas publicados para o catálogo)
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
  } = useQuery({
    queryKey: ["courses", "published"],
    queryFn: () => getCourses({ filter: "published" }),
    select: (data) => data.courses,
  });

  const { user } = useAuth();
  // Fetch user enrollments to check which courses user is enrolled in
  const { data: enrollmentsData } = useQuery({
    queryKey: ["user-enrollments", user?.id],
    queryFn: () => getUserEnrollments(user!.id),
    select: (data) => data.enrollments,
    enabled: !!user?.id,
  });

  // Transform courses data for compatibility with existing components
  const courses =
    coursesData?.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      image: course.image || "/api/placeholder/300/200",
      duration: course.duration,
      level: course.level,
      category: course.category,
      instructor: course.instructor?.name || "Instrutor não definido",
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

  const categories = [
    { id: "all", name: "Todas", icon: Grid },
    { id: "CREATIVITY", name: "Criatividade", icon: Palette },
    { id: "PROVISION", name: "Provisão", icon: Database },
    { id: "MULTIPLICATION", name: "Multiplicação", icon: TrendingUp },
  ];

  const levels = [
    { id: "all", name: "Todos os níveis" },
    { id: "iniciante", name: "Iniciante" },
    { id: "intermediario", name: "Intermediário" },
    { id: "avancado", name: "Avançado" },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" || course.category === selectedCategory;
    const matchesLevel =
      selectedLevel === "all" || course.level?.toLowerCase() === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const featuredCourses = courses.filter(
    (course) => course.isFeatured && course.isPublished,
  );
  const enrolledCourses = courses.filter((course) => course.isEnrolled);

  // Loading state
  if (coursesLoading) {
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
  if (coursesError) {
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
        {/* View Mode Toggle */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button className="dark-glass dark-border hover:dark-border-hover gap-2">
              <Filter size={16} />
              Filtros avançados
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
      </PageHeader>

      {/* Search and Filters */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search
              className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
              size={20}
            />
            <Input
              placeholder="Buscar por cursos, instrutores ou temas ministeriais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dark-input h-12 pl-12 text-base"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="dark-input h-12 w-48">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="dark-bg-secondary dark-border">
              {categories.map((category) => (
                <SelectItem
                  key={category.id}
                  value={category.id}
                  className="dark-text-primary hover:dark-bg-tertiary"
                >
                  <div className="flex items-center space-x-2">
                    <category.icon size={16} />
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="dark-input h-12 w-48">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent className="dark-bg-secondary dark-border">
              {levels.map((level) => (
                <SelectItem
                  key={level.id}
                  value={level.id}
                  className="dark-text-primary hover:dark-bg-tertiary"
                >
                  {level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="grid"
                      variant="catalog"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      layout="list"
                      variant="catalog"
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
                    : "Nenhum curso disponível"}
                </h3>
                <p className="dark-text-tertiary mb-4 text-sm">
                  {searchQuery
                    ? "Tente ajustar sua busca ou filtros"
                    : "Não há cursos disponíveis no momento"}
                </p>
                <Button className="dark-btn-primary">
                  {searchQuery ? "Limpar Busca" : "Explorar Cursos"}
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="featured" className="mt-6">
            {featuredCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    layout="grid"
                    variant="catalog"
                  />
                ))}
              </div>
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
                <Button className="dark-btn-primary">
                  Ver Todos os Cursos
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="enrolled" className="mt-6">
            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    layout="grid"
                    variant="catalog"
                  />
                ))}
              </div>
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.slice(0, 6).map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    layout="grid"
                    variant="catalog"
                  />
                ))}
              </div>
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
                <Button className="dark-btn-primary">
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
