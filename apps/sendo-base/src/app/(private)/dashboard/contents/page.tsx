"use client";

import { formatDate, formatDuration } from "@/src/lib/formatters";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
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
  Filter,
  Grid,
  Heart,
  List,
  Play,
  Search,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ConteudosPage() {
  const [searchQuery, setSearchQuery] = useState("");
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
      progress: 6,
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
      progress: 6,
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
      progress: 60,
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
      progress: 6,
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
      progress: 6,
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
      progress: 6,
      isFeatured: false,
      tags: ["Liderança", "Ministério", "Pastoreio"],
    },
  ];

  const filteredEnrollments = courses.filter((course) =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
                {Math.round(
                  courses.reduce((acc, c) => acc + c.progress, 0) /
                    courses.length,
                )}
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
                value="not-started"
                className="data-[state=active]:dark-btn-primary dark-text-secondary data-[state=active]:dark-text-primary text-sm"
              >
                Não Iniciados ({courses.filter((c) => c.progress === 0).length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredEnrollments.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredEnrollments.map((course) => (
                    <CourseListCard key={course.id} course={course} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="in-progress" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEnrollments
                  .filter((e) => e.progress > 0 && e.progress < 100)
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEnrollments
                  .filter((c) => c.progress === 100)
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="not-started" className="mt-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEnrollments
                  .filter((c) => c.progress === 0)
                  .map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: any }) {
  return (
    <div className="dark-card dark-shadow-sm group cursor-pointer overflow-hidden rounded-xl">
      <div className="relative">
        <div className="dark-bg-tertiary flex h-48 w-full items-center justify-center">
          <BookOpen className="dark-text-tertiary" size={48} />
        </div>
        <div className="absolute top-3 left-3">
          <span className="dark-glass dark-primary rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm">
            {course.level}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium shadow-lg ${
              course.progress === 100
                ? "dark-success-bg dark-success"
                : course.progress > 50
                  ? "dark-warning-bg dark-warning"
                  : "dark-primary-subtle-bg dark-primary"
            }`}
          >
            {course.progress}%
          </span>
        </div>
        {course.progress > 0 && course.progress < 100 && (
          <div className="absolute bottom-3 left-3">
            <span className="dark-gradient-primary rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg">
              Em Andamento
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="dark-text-primary group-hover:dark-primary line-clamp-2 font-semibold transition-colors">
            {course.title}
          </h3>
          <Button variant="ghost" size="sm" className="hover:dark-bg-tertiary">
            <ArrowRight className="dark-text-secondary" size={16} />
          </Button>
        </div>

        <p className="dark-text-secondary mb-4 line-clamp-2 text-sm">
          {course.description}
        </p>

        <div className="dark-text-tertiary mb-3 flex items-center text-sm">
          <Users size={14} className="mr-1" />
          <span>{course.instructor}</span>
        </div>

        <div className="dark-text-tertiary mb-4 flex items-center justify-between text-sm">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formatDuration(course.duration)}</span>
          </div>
          <div className="flex items-center">
            <BookOpen size={14} className="mr-1" />
            <span>
              {course.completedLessons}/{course.totalLessons} aulas
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="dark-text-secondary font-medium">Progresso</span>
            <span className="dark-primary font-semibold">
              {course.progress}%
            </span>
          </div>
          <div className="dark-bg-tertiary h-2 w-full rounded-full">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                course.progress === 100
                  ? "dark-gradient-secondary"
                  : "dark-gradient-primary"
              }`}
              style={{ width: `${course.progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4">
          <Button
            asChild
            className={`w-full ${
              course.progress === 0
                ? "dark-btn-primary"
                : course.progress === 100
                  ? "dark-gradient-secondary"
                  : "dark-gradient-primary"
            }`}
          >
            <Link href={`/dashboard/courses/${course.id}`}>
              <Play size={16} className="mr-2" />
              {course.progress === 0
                ? "Começar"
                : course.progress === 100
                  ? "Revisar"
                  : "Continuar"}
            </Link>
          </Button>
        </div>

        {course.lastAccessed && (
          <div className="dark-bg-secondary mt-3 rounded-lg px-3 py-2 text-xs">
            <span className="dark-text-tertiary">
              Último acesso: {formatDate(course.lastAccessed)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseListCard({ course }: { course: any }) {
  return (
    <div className="dark-card dark-shadow-sm group cursor-pointer overflow-hidden rounded-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="dark-bg-tertiary flex h-20 w-20 items-center justify-center rounded-lg">
              <BookOpen className="dark-text-tertiary" size={24} />
            </div>
            {course.isFeatured && (
              <div className="absolute -top-2 -right-2">
                <div className="dark-gradient-primary flex h-6 w-6 items-center justify-center rounded-full">
                  <TrendingUp className="dark-text-primary" size={12} />
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-start justify-between">
                  <h3 className="dark-text-primary group-hover:dark-primary line-clamp-1 font-semibold transition-colors">
                    {course.title}
                  </h3>
                  <div className="ml-2 flex items-center space-x-2">
                    <span className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium">
                      {course.level}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="dark-glass dark-border hover:dark-border-hover h-8 w-8 p-0 backdrop-blur-sm"
                    >
                      <Heart className="dark-text-primary" size={14} />
                    </Button>
                  </div>
                </div>

                <p className="dark-text-secondary mb-3 line-clamp-1 text-sm">
                  {course.description}
                </p>

                <div className="dark-text-tertiary flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <Users size={14} className="mr-1" />
                    <span>{course.instructor}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>{formatDuration(course.duration)}</span>
                  </div>
                  <div className="flex items-center">
                    <Star size={14} className="dark-secondary mr-1" />
                    <span>{course.rating}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen size={14} className="mr-1" />
                    <span>{course.enrolledStudents?.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="ml-6 text-right">
                <div className="dark-text-primary mb-3 text-lg font-bold">
                  {course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
                </div>
                <Button
                  asChild
                  size="sm"
                  className={
                    course.isEnrolled
                      ? "dark-gradient-secondary"
                      : "dark-btn-primary"
                  }
                >
                  <Link
                    href={
                      course.isEnrolled
                        ? `/dashboard/courses/${course.id}`
                        : `/dashboard/catalog/${course.id}`
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
      </div>
    </div>
  );
}
