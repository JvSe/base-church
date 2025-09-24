"use client";

import { deleteCourse, getCourses } from "@/src/lib/actions";
import { Button } from "@base-church/ui/components/button";
import { Input } from "@base-church/ui/components/input";
import { useQuery } from "@tanstack/react-query";
import {
    Award,
    BookOpen,
    CheckCircle,
    Clock,
    Edit,
    FileText,
    Plus,
    Search,
    Star,
    Trash2,
    TrendingUp,
    Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number; // em minutos
  level: "beginner" | "intermediate" | "advanced";
  status: "draft" | "published" | "archived";
  studentsEnrolled: number;
  studentsCompleted: number;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  category: string;
  tags: string[];
}

export default function CoursesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  // Buscar cursos do banco (todos os cursos para o dashboard)
  const {
    data: coursesData,
    isLoading: coursesLoading,
    error: coursesError,
    refetch: refetchCourses,
  } = useQuery({
    queryKey: ["courses", "all"],
    queryFn: () => getCourses({ filter: "all" }),
    select: (data) => data.courses,
  });

  const courses: Course[] = useMemo(() => {
    return (
      coursesData?.map((course: any) => ({
        id: course.id,
        title: course.title,
        description: course.description,
        instructor: course.instructor?.name || "Instrutor não definido",
        duration: course.duration,
        level: course.level,
        status: course.isPublished ? "published" : "draft",
        studentsEnrolled: course._count?.enrollments || 0,
        studentsCompleted: 0, // TODO: Implementar contagem de completados
        averageRating: course.rating || 0,
        totalRatings: course._count?.reviews || 0,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        price: course.price,
        category: course.category,
        tags: course.tags || [],
      })) || []
    );
  }, [coursesData]);

  // Filtrar cursos com useMemo para evitar re-renderizações desnecessárias
  const filteredCourses = useMemo(() => {
    if (!searchTerm.trim()) return courses;

    return courses.filter(
      (course) =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
    );
  }, [courses, searchTerm]);

  const getStatusColor = (status: Course["status"]) => {
    switch (status) {
      case "published":
        return "text-green-400 bg-green-400/20 border border-green-400/30";
      case "draft":
        return "text-yellow-400 bg-yellow-400/20 border border-yellow-400/30";
      case "archived":
        return "text-gray-400 bg-gray-400/20 border border-gray-400/30";
      default:
        return "text-gray-400 bg-gray-400/20 border border-gray-400/30";
    }
  };

  const getStatusText = (status: Course["status"]) => {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Rascunho";
      case "archived":
        return "Arquivado";
      default:
        return "Desconhecido";
    }
  };

  const getStatusIcon = (status: Course["status"]) => {
    switch (status) {
      case "published":
        return CheckCircle;
      case "draft":
        return FileText;
      case "archived":
        return FileText;
      default:
        return FileText;
    }
  };

  const getLevelColor = (level: Course["level"]) => {
    switch (level) {
      case "beginner":
        return "text-green-400 bg-green-400/20";
      case "intermediate":
        return "text-yellow-400 bg-yellow-400/20";
      case "advanced":
        return "text-red-400 bg-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/20";
    }
  };

  const getLevelText = (level: Course["level"]) => {
    switch (level) {
      case "beginner":
        return "Iniciante";
      case "intermediate":
        return "Intermediário";
      case "advanced":
        return "Avançado";
      default:
        return "Desconhecido";
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };

  // Loading state
  if (coursesLoading) {
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
              Carregando cursos...
            </h1>
            <p className="dark-text-secondary">Buscando cursos disponíveis</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (coursesError) {
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
              Erro ao carregar cursos
            </h1>
            <p className="dark-text-secondary mb-4">
              Não foi possível carregar os cursos. Tente novamente.
            </p>
            <Button
              className="dark-btn-primary"
              onClick={() => refetchCourses()}
            >
              Tentar Novamente
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const totalCourses = courses.length;
  const publishedCourses = courses.filter(
    (c) => c.status === "published",
  ).length;
  const totalStudents = courses.reduce((sum, c) => sum + c.studentsEnrolled, 0);
  const totalCompletions = courses.reduce(
    (sum, c) => sum + c.studentsCompleted,
    0,
  );

  // Empty state component
  const EmptyStateCard = ({
    icon: Icon,
    title,
    description,
    actionText,
    onAction,
  }: {
    icon: any;
    title: string;
    description: string;
    actionText?: string;
    onAction?: () => void;
  }) => (
    <div className="dark-card dark-shadow-sm rounded-xl p-8 text-center">
      <div className="dark-bg-secondary mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <Icon className="dark-text-tertiary" size={24} />
      </div>
      <h3 className="dark-text-primary mb-2 font-semibold">{title}</h3>
      <p className="dark-text-tertiary mb-4 text-sm">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="dark-btn-primary">
          {actionText}
        </Button>
      )}
    </div>
  );

  return (
    <div className="dark-bg-primary min-h-screen">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-3">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--color-dark-text-tertiary)_1px,transparent_0)] bg-[length:60px_60px]" />
      </div>

      <div className="relative mx-auto max-w-7xl space-y-8 p-6">
        {/* Header */}
        <div className="dark-glass dark-shadow-md rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="dark-text-primary mb-2 text-3xl font-bold">
                Gestão de Cursos 📚
              </h1>
              <p className="dark-text-secondary">
                Gerencie seus cursos e acompanhe o desempenho
              </p>
            </div>
            <Link href="/dashboard/courses/create">
              <Button className="dark-btn-primary">
                <Plus className="mr-2 h-4 w-4" />
                Criar Curso Completo
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Total de Cursos
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {totalCourses}
                </p>
              </div>
              <div className="dark-primary-subtle-bg rounded-xl p-3">
                <BookOpen className="dark-primary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {totalCourses} cursos criados
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Cursos Publicados
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {publishedCourses}
                </p>
              </div>
              <div className="dark-success-bg rounded-xl p-3">
                <TrendingUp className="dark-success" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {Math.round((publishedCourses / totalCourses) * 100)}%
                publicados
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Total de Inscrições
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {totalStudents}
                </p>
              </div>
              <div className="dark-secondary-subtle-bg rounded-xl p-3">
                <Users className="dark-secondary" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {Math.round(totalStudents / totalCourses)} por curso
              </span>
            </div>
          </div>

          <div className="dark-card dark-shadow-sm rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="dark-text-tertiary text-sm font-medium">
                  Conclusões
                </p>
                <p className="dark-text-primary text-2xl font-bold">
                  {totalCompletions}
                </p>
              </div>
              <div className="dark-warning-bg rounded-xl p-3">
                <Award className="dark-warning" size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="dark-success mr-1" size={16} />
              <span className="dark-success font-medium">
                {Math.round((totalCompletions / totalStudents) * 100)}% taxa
              </span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-4 flex items-center gap-2 text-xl font-bold">
            <Search className="dark-primary" size={24} />
            Buscar Cursos
          </h2>
          <div className="relative">
            <Search className="dark-text-tertiary absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input
              placeholder="Buscar por título, instrutor, categoria ou tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark-input pl-10"
            />
          </div>
        </div>

        {/* Courses List */}
        <div className="dark-glass dark-shadow-sm rounded-xl p-6">
          <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
            <BookOpen className="dark-primary" size={24} />
            Lista de Cursos ({filteredCourses.length})
          </h2>

          <div className="space-y-4">
            {filteredCourses.length > 0 ? (
              filteredCourses.map((course) => (
                <div
                  key={course.id}
                  className={`dark-card dark-shadow-sm rounded-xl p-4 ${
                    course.status === "draft"
                      ? "border-l-4 border-l-yellow-400"
                      : course.status === "published"
                        ? "border-l-4 border-l-green-400"
                        : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="dark-primary-subtle-bg flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg">
                      <BookOpen className="dark-primary" size={20} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="dark-text-primary font-semibold">
                            {course.title}
                          </h3>
                          <p className="dark-text-secondary mt-1 text-sm">
                            {course.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {course.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300"
                              >
                                {tag}
                              </span>
                            ))}
                            {course.tags.length > 3 && (
                              <span className="inline-flex items-center rounded-full bg-gray-700 px-2 py-1 text-xs text-gray-300">
                                +{course.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(course.status)}`}
                          >
                            {(() => {
                              const StatusIcon = getStatusIcon(course.status);
                              return <StatusIcon size={12} />;
                            })()}
                            {getStatusText(course.status)}
                          </span>
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getLevelColor(course.level)}`}
                          >
                            {getLevelText(course.level)}
                          </span>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="dark-glass dark-border hover:dark-border-hover"
                              onClick={() =>
                                router.push(
                                  `/dashboard/courses/${course.id}/edit`,
                                )
                              }
                              title="Editar curso"
                            >
                              <Edit className="h-3 w-3" />
                            </Button>

                            <Button
                              size="sm"
                              className="dark-glass dark-border hover:dark-border-hover"
                              onClick={async () => {
                                if (
                                  confirm(
                                    `Tem certeza que deseja excluir o curso "${course.title}"?`,
                                  )
                                ) {
                                  try {
                                    const result = await deleteCourse(
                                      course.id,
                                    );
                                    if (result.success) {
                                      toast.success(result.message);
                                      refetchCourses(); // Recarregar dados do banco
                                    } else {
                                      toast.error(result.error);
                                    }
                                  } catch (error) {
                                    toast.error("Erro ao excluir curso");
                                  }
                                }
                              }}
                              title="Excluir curso"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="space-y-1">
                          <div className="dark-text-secondary text-sm">
                            <Clock className="mr-1 inline h-3 w-3" />
                            Duração: {formatDuration(course.duration)}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            Instrutor: {course.instructor}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="dark-text-secondary text-sm">
                            <Users className="mr-1 inline h-3 w-3" />
                            Inscritos: {course.studentsEnrolled}
                          </div>
                          <div className="dark-text-secondary text-sm">
                            <Award className="mr-1 inline h-3 w-3" />
                            Completados: {course.studentsCompleted}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="dark-text-secondary text-sm">
                            Taxa de conclusão:{" "}
                            {course.studentsEnrolled > 0
                              ? Math.round(
                                  (course.studentsCompleted /
                                    course.studentsEnrolled) *
                                    100,
                                )
                              : 0}
                            %
                          </div>
                          <div className="dark-text-secondary text-sm">
                            Categoria: {course.category}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Star className="mr-1 h-3 w-3 fill-current text-yellow-400" />
                            <span className="dark-text-secondary">
                              {course.averageRating.toFixed(1)} (
                              {course.totalRatings})
                            </span>
                          </div>
                          <div className="dark-text-secondary text-sm">
                            Criado em {formatDate(course.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyStateCard
                icon={BookOpen}
                title={
                  searchTerm ? "Nenhum curso encontrado" : "Nenhum curso criado"
                }
                description={
                  searchTerm
                    ? "Tente ajustar sua busca ou filtros para encontrar o que procura"
                    : "Comece criando seu primeiro curso para compartilhar conhecimento"
                }
                actionText={
                  searchTerm ? "Limpar Busca" : "Criar Primeiro Curso"
                }
                onAction={() => {
                  if (searchTerm) {
                    setSearchTerm("");
                  } else {
                    router.push("/dashboard/courses/create");
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
