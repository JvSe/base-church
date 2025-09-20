"use client";

import { formatDuration } from "@/src/lib/formatters";
import { Button } from "@repo/ui/components/button";
import {
  BookOpen,
  Clock,
  Heart,
  Play,
  Star,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

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
  progress?: number;
  status?: string;
}

interface DashboardCourseListCardProps {
  course: Course;
  disabled?: boolean;
}

export function DashboardCourseListCard({
  course,
  disabled = false,
}: DashboardCourseListCardProps) {
  return (
    <div
      className={`dark-card dark-shadow-sm overflow-hidden rounded-xl ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "group cursor-pointer transition-all duration-300"
      }`}
    >
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
                  <h3
                    className={`dark-text-primary line-clamp-1 font-semibold ${
                      disabled
                        ? ""
                        : "group-hover:dark-primary transition-colors"
                    }`}
                  >
                    {course.title}
                  </h3>
                  <div className="ml-2 flex items-center space-x-2">
                    <span className="dark-primary-subtle-bg dark-primary rounded-full px-2 py-1 text-xs font-medium">
                      {course.level}
                    </span>
                    {!disabled && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="dark-glass dark-border hover:dark-border-hover h-8 w-8 p-0 backdrop-blur-sm"
                      >
                        <Heart className="dark-text-primary" size={14} />
                      </Button>
                    )}
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
                {!disabled ? (
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
                          ? `/courses/${course.id}`
                          : `/catalog/${course.id}`
                      }
                    >
                      <Play size={16} className="mr-2" />
                      {course.isEnrolled ? "Continuar" : "Matricular"}
                    </Link>
                  </Button>
                ) : (
                  <div className="dark-bg-tertiary dark-text-tertiary flex h-8 items-center justify-center rounded-lg px-3 text-sm font-medium">
                    <Play size={16} className="mr-2" />
                    Aguardando Aprovação
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
