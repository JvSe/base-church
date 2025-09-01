"use client";

import { DashboardCourseCard } from "@/src/components/dashboard-course-card";
import { DashboardCourseListCard } from "@/src/components/dashboard-course-list-card";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import {
  Code,
  Database,
  Filter,
  Globe,
  Grid,
  List,
  Palette,
  Search,
  Server,
  Smartphone,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useState } from "react";

export default function CatalogoPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data - in real app this would come from server actions
  const courses = [
    {
      id: "1",
      title: "Sendo Base - Fundamentos Ministeriais",
      description:
        "Aprenda os fundamentos ministeriais da Base Church, criando uma base sólida para o ministério com princípios bíblicos.",
      image: "/api/placeholder/300/200",
      duration: 120,
      level: "Iniciante",
      category: "Fundamentos",
      instructor: "Pr. Robson",
      price: 0,
      rating: 4.8,
      enrolledStudents: 15420,
      isEnrolled: true,
      isFeatured: true,
      tags: ["Sendo Base", "Fundamentos", "Ministério", "Bíblia"],
    },
    {
      id: "2",
      title: "Cultura da Igreja - Princípios Bíblicos",
      description:
        "Construa uma cultura de igreja baseada em princípios bíblicos sólidos e práticos.",
      image: "/api/placeholder/300/200",
      duration: 180,
      level: "Intermediário",
      category: "Cultura",
      instructor: "Pr. João",
      price: 0,
      rating: 4.9,
      enrolledStudents: 12350,
      isEnrolled: false,
      isFeatured: true,
      tags: ["Cultura", "Igreja", "Princípios", "Bíblia"],
    },
    {
      id: "3",
      title: "Discipulado - Do Básico ao Avançado",
      description:
        "Domine o discipulado e leve seu ministério ao próximo nível com princípios bíblicos.",
      image: "/api/placeholder/300/200",
      duration: 150,
      level: "Intermediário",
      category: "Discipulado",
      instructor: "Pr. Maria",
      price: 0,
      rating: 4.7,
      enrolledStudents: 9870,
      isEnrolled: false,
      isFeatured: false,
      tags: ["Discipulado", "Ministério", "Bíblia"],
    },
    {
      id: "4",
      title: "Base Vida - Desenvolvimento Pessoal",
      description:
        "Crie uma vida baseada em princípios bíblicos com a Base Church.",
      image: "/api/placeholder/300/200",
      duration: 240,
      level: "Iniciante",
      category: "Vida",
      instructor: "Pr. Ana",
      price: 0,
      rating: 4.6,
      enrolledStudents: 7560,
      isEnrolled: false,
      isFeatured: false,
      tags: ["Base Vida", "Desenvolvimento", "Pessoal"],
    },
    {
      id: "5",
      title: "Família - Princípios Bíblicos",
      description:
        "Desenvolva uma família baseada em princípios bíblicos sólidos.",
      image: "/api/placeholder/300/200",
      duration: 200,
      level: "Intermediário",
      category: "Família",
      instructor: "Pr. Carlos",
      price: 0,
      rating: 4.5,
      enrolledStudents: 6540,
      isEnrolled: false,
      isFeatured: false,
      tags: ["Família", "Princípios", "Bíblia"],
    },
    {
      id: "6",
      title: "Liderança - Princípios Ministeriais",
      description:
        "Aprenda liderança para ministério, pastoreio e desenvolvimento de líderes.",
      image: "/api/placeholder/300/200",
      duration: 300,
      level: "Avançado",
      category: "Liderança",
      instructor: "Pr. Pedro",
      price: 0,
      rating: 4.8,
      enrolledStudents: 5430,
      isEnrolled: false,
      isFeatured: false,
      tags: ["Liderança", "Ministério", "Pastoreio"],
    },
  ];

  const categories = [
    { id: "all", name: "Todas", icon: Grid },
    { id: "fundamentos", name: "Fundamentos", icon: Code },
    { id: "cultura", name: "Cultura", icon: Server },
    { id: "discipulado", name: "Discipulado", icon: Smartphone },
    { id: "vida", name: "Vida", icon: Target },
    { id: "familia", name: "Família", icon: Database },
    { id: "lideranca", name: "Liderança", icon: Palette },
    { id: "pastoral", name: "Pastoral", icon: Globe },
  ];

  const levels = [
    { id: "all", name: "Todos os níveis" },
    { id: "iniciante", name: "Iniciante" },
    { id: "intermediario", name: "Intermediário" },
    { id: "avancado", name: "Avançado" },
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchesCategory =
      selectedCategory === "all" ||
      course.category.toLowerCase() === selectedCategory;
    const matchesLevel =
      selectedLevel === "all" || course.level.toLowerCase() === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  const featuredCourses = courses.filter((course) => course.isFeatured);
  const enrolledCourses = courses.filter((course) => course.isEnrolled);

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-6 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Catálogo de Cursos
              </h1>
              <p className="dark-text-secondary">
                Explore milhares de cursos e encontre o que você precisa para
                evoluir
              </p>
            </div>

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
        </div>

        {/* Search and Filters */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search
                className="dark-text-tertiary absolute top-1/2 left-4 -translate-y-1/2 transform"
                size={20}
              />
              <Input
                placeholder="Buscar por cursos, instrutores ou tecnologias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="dark-input h-12 pl-12 text-base"
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
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
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <DashboardCourseCard
                      key={course.id}
                      course={course}
                      variant="catalog"
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <DashboardCourseListCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredCourses.map((course) => (
                  <DashboardCourseCard
                    key={course.id}
                    course={course}
                    variant="catalog"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enrolled" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {enrolledCourses.map((course) => (
                  <DashboardCourseCard
                    key={course.id}
                    course={course}
                    variant="catalog"
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="recommended" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredCourses.slice(0, 6).map((course) => (
                  <DashboardCourseCard
                    key={course.id}
                    course={course}
                    variant="catalog"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
