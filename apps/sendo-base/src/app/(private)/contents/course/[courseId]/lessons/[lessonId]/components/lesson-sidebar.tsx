"use client";

import { formatDuration } from "@/src/lib/formatters";
import { Button } from "@base-church/ui/components/button";
import {
  Award,
  CheckCircle,
  Circle,
  Lock,
  PanelRightClose,
} from "lucide-react";
import Link from "next/link";

type LessonSidebarProps = {
  course: any;
  currentLessonId: string;
  onToggleSidebar: () => void;
};

export function LessonSidebar({
  course,
  currentLessonId,
  onToggleSidebar,
}: LessonSidebarProps) {
  return (
    <div className="dark-bg-primary dark-border dark-glass dark-border dark-shadow-lg flex w-96 flex-col rounded-lg border-l">
      {/* Sidebar Header */}
      <div className="dark-border flex flex-row gap-3 border-b p-4">
        {/* Progress Circle */}
        <div className="mb-4 flex items-center justify-center">
          <div className="relative h-16 w-16">
            <svg className="h-16 w-16" viewBox="0 0 36 36">
              {/* Background circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
              />
              {/* Progress circle */}
              <path
                d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeDasharray={`${typeof course.progress === "number" ? course.progress : 0}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {Math.round(
                  typeof course.progress === "number" ? course.progress : 0,
                )}
                %
              </span>
            </div>
          </div>
        </div>

        {/* Course Info */}
        <div className="flex w-full flex-row justify-between text-left">
          <div>
            <h4 className="text-lg leading-tight font-bold text-white">
              {course.title}
            </h4>
            <p className="mt-1 text-sm text-gray-300">
              {typeof course.completedLessons === "number"
                ? course.completedLessons
                : 0}{" "}
              de{" "}
              {typeof course.totalLessons === "number"
                ? course.totalLessons
                : 0}{" "}
              aulas
            </p>
          </div>

          <div className="flex flex-col items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleSidebar}
              className="dark-text-secondary hover:dark-text-primary"
            >
              <PanelRightClose size={24} />
            </Button>
          </div>
        </div>
      </div>

      {/* Lessons List */}
      <div className="custom-scrollbar flex-1 overflow-y-auto">
        {course.modules.map((module: any) => (
          <div key={module.id} className="dark-border">
            <div className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h4 className="dark-text-primary font-medium">
                    {module.title}
                  </h4>
                  {module.isLocked && (
                    <Lock size={14} className="dark-text-tertiary" />
                  )}
                </div>
                <span className="dark-text-tertiary text-sm">
                  {module.lessons.length} aulas •{" "}
                  {formatDuration(
                    module.lessons.reduce(
                      (total: number, l: any) => total + (l.duration || 0),
                      0,
                    ),
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
            </div>

            <div className="space-y-1 pb-4">
              {module.lessons.map((moduleLesson: any) => (
                <div key={moduleLesson.id}>
                  {moduleLesson.isLocked ? (
                    <div className="mx-4 flex cursor-not-allowed items-center space-x-3 rounded-lg px-4 py-3 opacity-50">
                      <Lock
                        size={16}
                        className="dark-text-tertiary flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="dark-text-tertiary truncate text-sm font-medium">
                          {moduleLesson.title}
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
                      href={`/contents/course/${course.id}/lessons/${moduleLesson.id}`}
                      className={`mx-4 flex cursor-pointer items-center space-x-3 rounded-lg px-4 py-3 transition-all duration-200 ${
                        moduleLesson.id === currentLessonId
                          ? "dark-gradient-primary text-white shadow-lg"
                          : "hover:dark-bg-tertiary hover:shadow-sm"
                      }`}
                    >
                      {moduleLesson.isCompleted ? (
                        <CheckCircle
                          size={16}
                          className="dark-success flex-shrink-0"
                        />
                      ) : moduleLesson.isWatched ? (
                        <Circle
                          size={16}
                          className="dark-primary flex-shrink-0"
                        />
                      ) : moduleLesson.type === "certificate" ? (
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
                            moduleLesson.id === currentLessonId
                              ? "text-white"
                              : "dark-text-primary"
                          }`}
                        >
                          {moduleLesson.title}
                        </p>
                      </div>

                      <span
                        className={`flex-shrink-0 text-xs ${
                          moduleLesson.id === currentLessonId
                            ? "text-white/80"
                            : "dark-text-tertiary"
                        }`}
                      >
                        {formatDuration(moduleLesson.duration || 0)}
                      </span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
