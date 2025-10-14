"use client";

import { EmptyState } from "@/src/components/common/feedback/empty-state";
import { getCategoryInfo } from "@/src/lib/constants";
import { formatDate } from "@/src/lib/formatters";
import { getLevelFormatted } from "@/src/lib/helpers/level.helper";
import type { CourseLevel, CourseStatus } from "@/src/lib/types/index";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CourseActions } from "./course-actions";
import { CoursesSearch } from "./courses-search";

type DashboardCourse = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: number;
  level: CourseLevel;
  status: CourseStatus;
  studentsEnrolled: number;
  studentsCompleted: number;
  averageRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
  price: number;
  category: string;
  tags: string[];
};

type CoursesListClientProps = {
  courses: DashboardCourse[];
};

export function CoursesListClient({ courses }: CoursesListClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

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

  function getStatusColor(status: CourseStatus) {
    switch (status) {
      case "published":
        return "text-green-400 bg-green-400/20 border border-green-400/30";
      case "draft":
        return "text-yellow-400 bg-yellow-400/20 border border-yellow-400/30";
      case "archived":
        return "text-gray-400 bg-gray-400/20 border border-gray-400/30";
    }
  }

  function getStatusText(status: CourseStatus) {
    switch (status) {
      case "published":
        return "Publicado";
      case "draft":
        return "Rascunho";
      case "archived":
        return "Arquivado";
    }
  }

  function getStatusIcon(status: CourseStatus) {
    switch (status) {
      case "published":
        return CheckCircle;
      case "draft":
      case "archived":
        return FileText;
    }
  }

  function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}min`;
    }
    return `${mins}min`;
  }

  return (
    <>
      {/* Search */}
      <CoursesSearch value={searchTerm} onChange={setSearchTerm} />

      {/* Courses List */}
      <div className="dark-glass dark-shadow-sm rounded-xl p-6">
        <h2 className="dark-text-primary mb-6 flex items-center gap-2 text-xl font-bold">
          <BookOpen className="dark-primary" size={24} />
          Lista de Cursos ({filteredCourses.length})
        </h2>

        <div className="flex flex-col gap-4">
          {filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
              <Link
                key={course.id}
                href={`/dashboard/courses/${course.id}/edit`}
              >
                <div
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
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getLevelFormatted(course.level).color}`}
                          >
                            {getLevelFormatted(course.level).text}
                          </span>
                          <CourseActions
                            courseId={course.id}
                            courseTitle={course.title}
                            onDelete={() => router.refresh()}
                          />
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
                            Categoria: {getCategoryInfo(course.category).label}
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
              </Link>
            ))
          ) : (
            <EmptyState
              icon={BookOpen}
              title={
                searchTerm ? "Nenhum curso encontrado" : "Nenhum curso criado"
              }
              description={
                searchTerm
                  ? "Tente ajustar sua busca ou filtros para encontrar o que procura"
                  : "Comece criando seu primeiro curso para compartilhar conhecimento"
              }
              action={{
                label: searchTerm ? "Limpar Busca" : "Criar Primeiro Curso",
                onClick: () => {
                  if (searchTerm) {
                    setSearchTerm("");
                  } else {
                    router.push("/dashboard/courses/create");
                  }
                },
              }}
            />
          )}
        </div>
      </div>
    </>
  );
}
