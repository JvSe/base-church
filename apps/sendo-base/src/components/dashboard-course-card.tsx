"use client";

import { formatDate, formatDuration } from "@/src/lib/formatters";
import { Button } from "@base-church/ui/components/button";
import { cn } from "@base-church/ui/lib/utils";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Heart,
  Play,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";
import { getLevelFormatted } from "../lib/helpers/level.helper";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: number;
  level: string;
  instructor: string;
  price?: number;
  rating?: number;
  enrolledStudents?: number;
  isEnrolled?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  lastAccessed?: string;
}

interface DashboardCourseCardProps {
  course: Course;
  variant?: "catalog" | "contents";
  disabled?: boolean;
}

export function DashboardCourseCard({
  course,
  variant = "catalog",
  disabled = false,
}: DashboardCourseCardProps) {
  return (
    <Link
      href={
        variant === "catalog"
          ? course.isEnrolled
            ? `/contents/course/${course.id}`
            : `/catalog/courses/${course.id}`
          : `/contents/course/${course.id}`
      }
    >
      <div
        className={`dark-card dark-shadow-sm flex h-full flex-col overflow-hidden rounded-xl ${
          disabled ? "cursor-not-allowed opacity-60" : "group cursor-pointer"
        }`}
      >
        <div className="relative">
          <div className="dark-bg-tertiary flex h-48 w-full items-center justify-center">
            <BookOpen className="dark-text-tertiary" size={48} />
          </div>
          <div className="absolute top-3 left-3">
            <span
              className={cn(
                `rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm`,
                getLevelFormatted(course.level).color,
              )}
            >
              {getLevelFormatted(course.level).text}
            </span>
          </div>

          {variant === "catalog" ? (
            <div className="absolute top-3 right-3">
              <Button
                variant="ghost"
                size="sm"
                className="dark-glass dark-border hover:dark-border-hover backdrop-blur-sm"
              >
                <Heart className="dark-text-primary" size={16} />
              </Button>
            </div>
          ) : (
            <div className="absolute top-3 right-3">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium shadow-lg ${
                  course.progress === 100
                    ? "dark-success-bg dark-success"
                    : course.progress && course.progress > 50
                      ? "dark-warning-bg dark-warning"
                      : "dark-primary-subtle-bg dark-primary"
                }`}
              >
                {course.progress}%
              </span>
            </div>
          )}

          {variant === "catalog" && course.isFeatured && (
            <div className="absolute bottom-3 left-3">
              <span className="dark-gradient-primary dark-text-primary flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium shadow-lg">
                <TrendingUp size={12} />
                Em Destaque
              </span>
            </div>
          )}

          {/* {variant === "contents" &&
          course.progress &&
          course.progress > 0 &&
          course.progress < 100 && (
            <div className="absolute bottom-3 left-3">
              <span className="dark-gradient-primary rounded-full px-3 py-1 text-xs font-medium text-white shadow-lg">
                Em Andamento
              </span>
            </div>
          )} */}
        </div>

        <div className="flex h-full flex-col justify-between p-6">
          <div className="mb-3 flex items-start justify-between">
            <h3
              className={`dark-text-primary line-clamp-2 font-semibold ${
                disabled ? "" : "group-hover:dark-primary transition-colors"
              }`}
            >
              {course.title}
            </h3>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="hover:dark-bg-tertiary"
              >
                <ArrowRight className="dark-text-secondary" size={16} />
              </Button>
            )}
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

            {variant === "catalog" && (
              <>
                <div className="flex items-center">
                  <Star size={14} className="dark-secondary mr-1" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen size={14} className="mr-1" />
                  <span>
                    {course.enrolledStudents?.toLocaleString()} alunos
                  </span>
                </div>
              </>
            )}
          </div>

          {course.tags && (
            <div className="mb-4 flex flex-wrap gap-2">
              {course.tags.slice(0, 3).map((tag: string) => (
                <span
                  key={tag}
                  className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {variant === "contents" && course.progress !== undefined && (
            <div className="mb-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="dark-text-secondary font-medium">
                  Progresso
                </span>
                <span
                  className={cn(
                    "font-semibold",
                    course.progress === 100 ? "dark-success" : "dark-primary",
                  )}
                >
                  {course.progress}%
                </span>
              </div>
              <div className="dark-bg-tertiary h-2 w-full rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    disabled ? "" : "transition-all duration-300"
                  } ${
                    course.progress === 100
                      ? "bg-dark-success"
                      : "dark-gradient-primary"
                  }`}
                  style={{ width: `${course.progress}%` }}
                />
              </div>
            </div>
          )}

          {/* FOOTER */}
          <div className={"mt-auto flex items-center justify-between"}>
            {variant === "catalog" && (
              <div className="dark-text-primary text-lg font-bold">
                {course.price === 0 ? "Gratuito" : `R$ ${course.price}`}
              </div>
            )}

            {!disabled ? (
              <Button
                className={`${variant === "contents" ? "ml-auto w-full" : ""}${
                  variant === "catalog"
                    ? course.isEnrolled
                      ? "dark-gradient-secondary"
                      : "dark-btn-primary"
                    : course.progress === 0
                      ? "dark-btn-primary"
                      : course.progress === 100
                        ? "dark-gradient-secondary"
                        : "dark-gradient-primary"
                }`}
              >
                <Play size={16} className="mr-2" />
                {variant === "catalog"
                  ? course.isEnrolled
                    ? "Continuar"
                    : "Matricular"
                  : course.progress === 0
                    ? "Começar"
                    : course.progress === 100
                      ? "Revisar"
                      : "Continuar"}
              </Button>
            ) : (
              <div
                className={`${variant === "contents" ? "ml-auto w-full" : ""} dark-bg-tertiary dark-text-tertiary flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium`}
              >
                <Play size={16} className="mr-2" />
                Aguardando Aprovação
              </div>
            )}
          </div>

          {variant === "contents" && course.lastAccessed && (
            <div className="dark-bg-secondary mt-3 rounded-lg px-3 py-2 text-xs">
              <span className="dark-text-tertiary">
                Último acesso:{" "}
                {formatDate(course.lastAccessed as unknown as Date)}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
