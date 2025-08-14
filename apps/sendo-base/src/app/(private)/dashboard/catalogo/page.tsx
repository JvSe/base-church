"use client";

import { formatDuration } from "@/src/lib/formatters";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
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
  ArrowRight,
  BookOpen,
  Clock,
  Code,
  Database,
  Filter,
  Globe,
  Grid,
  Heart,
  List,
  Palette,
  Play,
  Search,
  Server,
  Smartphone,
  Star,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
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
    <div className="bg-background space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">
            Catálogo de Cursos
          </h1>
          <p className="text-muted-foreground">
            Explore milhares de cursos e encontre o que você precisa para
            evoluir
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
          >
            <Filter size={16} className="mr-2" />
            Filtros avançados
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className={
              viewMode === "grid"
                ? "bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
                : "border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
            }
          >
            <Grid size={16} />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
            className={
              viewMode === "list"
                ? "bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
                : "border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
            }
          >
            <List size={16} />
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search
            className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2 transform"
            size={20}
          />
          <Input
            placeholder="Buscar por cursos, instrutores ou tecnologias..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-dark-1/30 border-dark-2 focus:border-primary/50 pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="bg-dark-1/30 border-dark-2 focus:border-primary/50 w-48">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                <div className="flex items-center space-x-2">
                  <category.icon size={16} />
                  <span>{category.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="bg-dark-1/30 border-dark-2 focus:border-primary/50 w-48">
            <SelectValue placeholder="Nível" />
          </SelectTrigger>
          <SelectContent>
            {levels.map((level) => (
              <SelectItem key={level.id} value={level.id}>
                {level.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-dark-1/30 border-dark-1 grid w-full grid-cols-4">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Todos ({courses.length})
          </TabsTrigger>
          <TabsTrigger
            value="featured"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <TrendingUp size={16} className="mr-2" />
            Em Destaque ({featuredCourses.length})
          </TabsTrigger>
          <TabsTrigger
            value="enrolled"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <Zap size={16} className="mr-2" />
            Matriculados ({enrolledCourses.length})
          </TabsTrigger>
          <TabsTrigger
            value="recommended"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            <Target size={16} className="mr-2" />
            Recomendados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCourses.map((course) => (
                <CourseListCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="featured" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="enrolled" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recommended" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.slice(0, 6).map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <Card className="border-dark-1 bg-dark-1/30 group hover:shadow-primary/10 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-dark-1/80 text-foreground border-dark-2 border backdrop-blur-sm"
          >
            {course.level}
          </Badge>
        </div>
        <div className="absolute top-3 right-3">
          <Button
            variant="ghost"
            size="sm"
            className="bg-dark-1/80 hover:bg-dark-2/50 border-dark-2 border backdrop-blur-sm"
          >
            <Heart size={16} />
          </Button>
        </div>
        {course.isFeatured && (
          <div className="absolute bottom-3 left-3">
            <Badge
              variant="secondary"
              className="from-primary to-primary-2 text-primary-foreground bg-gradient-to-r shadow-lg"
            >
              <TrendingUp size={12} className="mr-1" />
              Em Destaque
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-foreground group-hover:text-primary line-clamp-2 font-semibold transition-colors">
            {course.title}
          </h3>
          <Button variant="ghost" size="sm" className="hover:bg-dark-2/50">
            <ArrowRight size={16} />
          </Button>
        </div>

        <p className="text-muted-foreground mb-4 line-clamp-2 text-sm">
          {course.description}
        </p>

        <div className="text-muted-foreground mb-3 flex items-center text-sm">
          <Users size={14} className="mr-1" />
          <span>{course.instructor}</span>
        </div>

        <div className="text-muted-foreground mb-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center">
            <Star size={14} className="text-secondary mr-1" />
            <span>{course.rating}</span>
          </div>
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>{course.enrolledStudents.toLocaleString()}</span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map((tag: string) => (
            <Badge
              key={tag}
              variant="outline"
              className="border-dark-2 text-muted-foreground text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-foreground text-lg font-bold">
            {course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
          </div>

          <Button
            asChild
            className={
              course.isEnrolled
                ? "from-secondary to-secondary-1 hover:from-secondary/90 hover:to-secondary-1/90 text-secondary-foreground hover:shadow-secondary/25 bg-gradient-to-r shadow-lg"
                : "bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
            }
          >
            <Link
              href={
                course.isEnrolled
                  ? `/dashboard/cursos/${course.id}`
                  : `/dashboard/catalogo/${course.id}`
              }
            >
              <Play size={16} className="mr-2" />
              {course.isEnrolled ? "Continuar" : "Matricular"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseListCard({ course }: { course: any }) {
  return (
    <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <img
            src={course.image}
            alt={course.title}
            className="h-20 w-20 rounded-lg object-cover"
          />

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-foreground mb-1 font-semibold">
                  {course.title}
                </h3>
                <p className="text-muted-foreground mb-2 text-sm">
                  {course.description}
                </p>

                <div className="text-muted-foreground flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="text-secondary mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={14} className="mr-1" />
                    <span>{course.enrolledStudents.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-foreground mb-2 text-lg font-bold">
                  {course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
                </div>
                <Button
                  asChild
                  size="sm"
                  className={
                    course.isEnrolled
                      ? "from-secondary to-secondary-1 hover:from-secondary/90 hover:to-secondary-1/90 text-secondary-foreground hover:shadow-secondary/25 bg-gradient-to-r shadow-lg"
                      : "bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
                  }
                >
                  <Link
                    href={
                      course.isEnrolled
                        ? `/dashboard/cursos/${course.id}`
                        : `/dashboard/catalogo/${course.id}`
                    }
                  >
                    <Play size={16} className="mr-2" />
                    {course.isEnrolled ? "Continuar" : "Matricular"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
