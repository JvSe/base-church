/**
 * Helper functions for course-related operations
 */

export function formatDuration(minutes: number): string {
  if (!minutes || minutes === 0) return "0min";

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  }

  return `${mins}min`;
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

export function getUserRoleLabel(
  role: string | undefined,
  isPastor: boolean | undefined,
): string {
  if (!role) return "Membro";

  const baseRole =
    role === "ADMIN" ? "Administrador" : role === "LIDER" ? "Líder" : "Membro";

  return isPastor ? `${baseRole} (Pastor)` : baseRole;
}

export function calculateCourseProgress(
  modules: any[],
  completedLessonIds: string[],
): number {
  const totalLessons = modules.reduce(
    (acc, module) => acc + (module.lessons?.length || 0),
    0,
  );

  if (totalLessons === 0) return 0;

  const completedLessons = completedLessonIds.length;
  return Math.round((completedLessons / totalLessons) * 100);
}

export function getModuleProgress(
  lessons: any[],
  completedLessonIds: string[],
): number {
  if (!lessons || lessons.length === 0) return 0;

  const completedInModule = lessons.filter((lesson) =>
    completedLessonIds.includes(lesson.id),
  ).length;

  return Math.round((completedInModule / lessons.length) * 100);
}

export function findNextIncompleteLesson(
  modules: any[],
  completedLessonIds: string[],
): any | null {
  for (const module of modules) {
    for (const lesson of module.lessons || []) {
      if (!completedLessonIds.includes(lesson.id) && !lesson.isLocked) {
        return lesson;
      }
    }
  }

  // Se todas foram completadas, retorna a primeira
  return modules[0]?.lessons?.[0] || null;
}

export function getLessonTypeIcon(type: string) {
  const iconMap: Record<string, string> = {
    VIDEO: "video",
    TEXT: "file-text",
    OBJECTIVE_QUIZ: "check-circle",
    SUBJECTIVE_QUIZ: "edit",
    video: "video",
    reading: "file-text",
    exercise: "target",
    quiz: "check-circle",
    certificate: "award",
  };

  return iconMap[type] || "book-open";
}
