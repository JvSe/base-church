"use client";

import {
  BookOpen,
  CheckCircle,
  Circle,
  FileText,
  Target,
  Video,
} from "lucide-react";
import Link from "next/link";
import {
  formatDuration,
  getModuleProgress,
} from "../../helpers/course.helpers";

type CourseCurriculumProps = {
  courseId: string;
  modules: any[];
  completedLessonIds: string[];
};

const iconMap = {
  VIDEO: Video,
  TEXT: FileText,
  OBJECTIVE_QUIZ: CheckCircle,
  SUBJECTIVE_QUIZ: Target,
  video: Video,
  reading: FileText,
  exercise: Target,
  quiz: CheckCircle,
};

function getTypeIcon(type: string) {
  return iconMap[type as keyof typeof iconMap] || BookOpen;
}

export function CourseCurriculum({
  courseId,
  modules,
  completedLessonIds,
}: CourseCurriculumProps) {
  return (
    <div className="dark-glass dark-shadow-sm rounded-xl p-6">
      <h2 className="dark-text-primary mb-6 text-xl font-bold">
        Conteúdo do Curso
      </h2>

      <div className="space-y-4">
        {modules.map((module) => {
          const moduleLessons = module.lessons || [];
          const moduleProgress = getModuleProgress(
            moduleLessons,
            completedLessonIds,
          );

          return (
            <div key={module.id} className="dark-card rounded-xl p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="dark-text-primary font-semibold">
                  {module.title}
                </h3>
                <div className="flex items-center gap-4 text-sm">
                  <span className="dark-text-tertiary">
                    {
                      completedLessonIds.filter((id) =>
                        moduleLessons.some((l: any) => l.id === id),
                      ).length
                    }
                    /{moduleLessons.length} aulas
                  </span>
                  <span className="dark-text-tertiary">
                    {formatDuration(
                      moduleLessons.reduce(
                        (total: number, l: any) => total + (l.duration || 0),
                        0,
                      ),
                    )}
                  </span>
                </div>
              </div>

              {/* Progresso do Módulo */}
              <div className="mb-4">
                <div className="dark-bg-tertiary h-1 w-full rounded-full">
                  <div
                    className="dark-gradient-primary h-1 rounded-full transition-all duration-300"
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
              </div>

              <p className="dark-text-secondary mb-4 text-sm">
                {module.description}
              </p>

              <div className="space-y-2">
                {moduleLessons.map((lesson: any) => {
                  const Icon = getTypeIcon(lesson.type || "video");
                  const isCompleted = completedLessonIds.includes(lesson.id);

                  return (
                    <Link
                      key={lesson.id}
                      href={`/contents/course/${courseId}/lessons/${lesson.id}`}
                      className="hover:dark-bg-secondary flex items-center justify-between rounded-lg px-3 py-2 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        {isCompleted ? (
                          <CheckCircle className="dark-success" size={16} />
                        ) : (
                          <Circle
                            className="dark-bg-tertiary rounded-full"
                            size={16}
                          />
                        )}
                        <Icon className="dark-text-tertiary" size={16} />
                        <span
                          className={`text-sm ${
                            isCompleted
                              ? "dark-text-secondary"
                              : "dark-text-primary"
                          }`}
                        >
                          {lesson.title}
                        </span>
                      </div>
                      <span className="dark-text-tertiary text-xs">
                        {formatDuration(lesson.duration || 0)}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
