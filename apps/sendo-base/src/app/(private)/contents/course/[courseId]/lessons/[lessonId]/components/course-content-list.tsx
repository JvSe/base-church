"use client";

import { formatDuration } from "@/src/lib/formatters";
import { Card } from "@base-church/ui/components/card";
import { Award, CheckCircle, Circle, Lock } from "lucide-react";
import Link from "next/link";

type CourseContentListProps = {
  course: any;
  currentLessonId: string;
};

export function CourseContentList({
  course,
  currentLessonId,
}: CourseContentListProps) {
  return (
    <Card className="dark-bg-primary dark-border p-4">
      <h3 className="dark-text-primary text-lg font-semibold">
        Módulos do Curso
      </h3>

      <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800 max-h-96 space-y-3 overflow-y-auto">
        {course.modules?.map((module: any, moduleIndex: number) => (
          <div key={module.id} className="dark-bg-secondary rounded-lg p-1">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h4 className="dark-text-primary font-medium">
                  {moduleIndex + 1}. {module.title}
                </h4>
                {module.isLocked && (
                  <Lock size={14} className="dark-text-tertiary" />
                )}
              </div>
              <span className="dark-text-tertiary text-xs">
                {module.lessons?.length || 0} aulas •{" "}
                {formatDuration(
                  module.lessons?.reduce(
                    (total: number, l: any) => total + (l.duration || 0),
                    0,
                  ) || 0,
                )}
              </span>
            </div>

            {module.isLocked && (
              <div className="mb-2 rounded-lg bg-yellow-500/10 px-3 py-2">
                <p className="dark-text-yellow text-xs">
                  🔒 Complete todas as aulas para desbloquear
                </p>
              </div>
            )}

            <div className="space-y-2">
              {module.lessons?.map((lesson: any, lessonIndex: number) => (
                <div key={lesson.id}>
                  {lesson.isLocked ? (
                    <div className="flex cursor-not-allowed items-center space-x-3 rounded-lg px-3 py-2 opacity-50">
                      <Lock
                        size={16}
                        className="dark-text-tertiary flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="dark-text-tertiary truncate text-sm font-medium">
                          {lessonIndex + 1}. {lesson.title}
                        </p>
                        <p className="dark-text-tertiary text-xs">
                          🔒 Bloqueado
                        </p>
                      </div>
                      <span className="dark-text-tertiary flex-shrink-0 text-xs">
                        --
                      </span>
                    </div>
                  ) : (
                    <Link
                      href={`/contents/course/${course.id}/lessons/${lesson.id}`}
                      className={`flex items-center space-x-3 rounded-lg px-3 py-2 transition-all duration-200 ${
                        lesson.id === currentLessonId
                          ? "dark-gradient-primary text-white shadow-lg"
                          : "hover:dark-bg-tertiary hover:shadow-sm"
                      }`}
                    >
                      {lesson.isCompleted ? (
                        <CheckCircle
                          size={16}
                          className="dark-success flex-shrink-0"
                        />
                      ) : lesson.isWatched ? (
                        <Circle
                          size={16}
                          className="dark-primary flex-shrink-0"
                        />
                      ) : lesson.type === "certificate" ? (
                        <Award
                          size={16}
                          className="dark-success flex-shrink-0"
                        />
                      ) : (
                        <Circle
                          size={16}
                          className="dark-text-tertiary flex-shrink-0"
                        />
                      )}

                      <div className="min-w-0 flex-1">
                        <p
                          className={`truncate text-sm font-medium ${
                            lesson.id === currentLessonId
                              ? "text-white"
                              : "dark-text-primary"
                          }`}
                        >
                          {lessonIndex + 1}. {lesson.title}
                        </p>
                        {lesson.duration && (
                          <p
                            className={`text-xs ${
                              lesson.id === currentLessonId
                                ? "text-white/80"
                                : "dark-text-tertiary"
                            }`}
                          >
                            {formatDuration(lesson.duration)}
                          </p>
                        )}
                      </div>

                      <span
                        className={`flex-shrink-0 text-xs ${
                          lesson.id === currentLessonId
                            ? "text-white/80"
                            : "dark-text-tertiary"
                        }`}
                      >
                        {formatDuration(lesson.duration || 0)}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
