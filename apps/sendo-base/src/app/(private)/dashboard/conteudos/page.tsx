"use client";

import { formatDate, formatDuration } from "@/src/lib/formatters";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Progress } from "@repo/ui/components/progress";
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
  List,
  Play,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function ConteudosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Mock data - in real app this would come from server actions
  const enrollments = [
    {
      id: "1",
      course: {
        id: "1",
        title: "Sendo Base - Fundamentos Ministeriais",
        description:
          "Aprenda os fundamentos ministeriais da Base Church, criando uma base sólida para o ministério.",
        image: "/api/placeholder/300/200",
        duration: 120, // minutes
        level: "Iniciante",
        instructor: "Pr. Robson",
        progress: 65,
        totalLessons: 32,
        completedLessons: 21,
        lastAccessed: new Date("2024-01-15"),
      },
    },
    {
      id: "2",
      course: {
        id: "2",
        title: "Cultura da Igreja - Princípios Bíblicos",
        description:
          "Construa uma cultura de igreja baseada em princípios bíblicos sólidos e práticos.",
        image: "/api/placeholder/300/200",
        duration: 180,
        level: "Intermediário",
        instructor: "Pr. João",
        progress: 30,
        totalLessons: 45,
        completedLessons: 14,
        lastAccessed: new Date("2024-01-10"),
      },
    },
    {
      id: "3",
      course: {
        id: "3",
        title: "Discipulado - Do Básico ao Avançado",
        description:
          "Domine o discipulado e leve seu ministério ao próximo nível com princípios bíblicos.",
        image: "/api/placeholder/300/200",
        duration: 150,
        level: "Intermediário",
        instructor: "Pr. Maria",
        progress: 0,
        totalLessons: 28,
        completedLessons: 0,
        lastAccessed: null,
      },
    },
  ];

  const filteredEnrollments = enrollments.filter((enrollment) =>
    enrollment.course.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-background space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-foreground text-2xl font-bold">Meus Conteúdos</h1>
          <p className="text-muted-foreground">
            Continue de onde parou e acompanhe seu progresso
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="border-dark-2 hover:bg-dark-2/50 hover:border-primary/50"
          >
            <Filter size={16} className="mr-2" />
            Filtrar
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

      {/* Search */}
      <div className="relative">
        <Search
          className="absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"
          size={20}
        />
        <Input
          placeholder="Buscar por cursos, aulas ou instrutores..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-dark-1/30 border-dark-2 focus:border-primary/50 pl-10"
        />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="bg-dark-1/30 border-dark-1 grid w-full grid-cols-4">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Todos ({enrollments.length})
          </TabsTrigger>
          <TabsTrigger
            value="in-progress"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Em andamento (
            {
              enrollments.filter(
                (e) => e.course.progress > 0 && e.course.progress < 100,
              ).length
            }
            )
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Concluídos (
            {enrollments.filter((e) => e.course.progress === 100).length})
          </TabsTrigger>
          <TabsTrigger
            value="not-started"
            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg"
          >
            Não iniciados (
            {enrollments.filter((e) => e.course.progress === 0).length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEnrollments.map((enrollment) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredEnrollments.map((enrollment) => (
                <CourseListCard key={enrollment.id} enrollment={enrollment} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnrollments
              .filter((e) => e.course.progress > 0 && e.course.progress < 100)
              .map((enrollment) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="completed" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnrollments
              .filter((e) => e.course.progress === 100)
              .map((enrollment) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="not-started" className="mt-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredEnrollments
              .filter((e) => e.course.progress === 0)
              .map((enrollment) => (
                <CourseCard key={enrollment.id} enrollment={enrollment} />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CourseCard({ enrollment }: { enrollment: any }) {
  const { course } = enrollment;

  return (
    <Card className="border-dark-1 bg-dark-1/30 hover:shadow-primary/10 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="h-48 w-full object-cover"
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
          <Badge
            variant="secondary"
            className="from-primary to-primary-2 text-primary-foreground bg-gradient-to-r shadow-lg"
          >
            {course.progress}%
          </Badge>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="mb-3 flex items-start justify-between">
          <h3 className="text-foreground line-clamp-2 font-semibold">
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
            <BookOpen size={14} className="mr-1" />
            <span>
              {course.completedLessons}/{course.totalLessons} aulas
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground font-medium">Progresso</span>
            <span className="text-primary font-semibold">
              {course.progress}%
            </span>
          </div>
          <Progress value={course.progress} className="bg-dark-2 h-2" />
        </div>

        <div className="mt-4 flex space-x-2">
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 flex-1 shadow-lg"
          >
            <Link href={`/dashboard/cursos/${course.id}`}>
              <Play size={16} className="mr-2" />
              Continuar
            </Link>
          </Button>
        </div>

        {course.lastAccessed && (
          <p className="text-muted-foreground bg-dark-1/30 mt-2 rounded-lg px-3 py-2 text-xs">
            Último acesso: {formatDate(course.lastAccessed)}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function CourseListCard({ enrollment }: { enrollment: any }) {
  const { course } = enrollment;

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
                    <BookOpen size={14} className="mr-1" />
                    <span>
                      {course.completedLessons}/{course.totalLessons} aulas
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <Badge
                  variant="secondary"
                  className="bg-primary text-primary-foreground mb-2"
                >
                  {course.progress}%
                </Badge>
                <Button
                  asChild
                  size="sm"
                  className="bg-primary hover:bg-primary/90 hover:shadow-primary/25 shadow-lg"
                >
                  <Link href={`/dashboard/cursos/${course.id}`}>
                    <Play size={16} className="mr-2" />
                    Continuar
                  </Link>
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <Progress value={course.progress} className="bg-dark-2 h-2" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
