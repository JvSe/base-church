import type {
  CourseLevel,
  CourseStatus,
  LessonType,
} from "@/src/lib/types/course.types";
import type { LucideIcon } from "lucide-react";
import {
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  FileText,
  Play,
  TrendingUp,
  Users,
} from "lucide-react";

/**
 * Helpers para Sistema de Cursos
 *
 * Centralizados para evitar duplicação
 * Antes: Duplicados em 3+ arquivos (~120 linhas duplicadas)
 * Depois: Arquivo único (~60 linhas)
 */

// ========================================
// LESSON TYPE HELPERS
// ========================================

/**
 * Retorna o ícone apropriado para cada tipo de lição
 */
export function getLessonTypeIcon(type: LessonType | string): LucideIcon {
  const normalizedType = type.toUpperCase();

  switch (normalizedType) {
    case "VIDEO":
      return Play;
    case "TEXT":
      return FileText;
    case "OBJECTIVE_QUIZ":
    case "SUBJECTIVE_QUIZ":
      return CheckCircle;
    default:
      return FileText;
  }
}

/**
 * Retorna o texto formatado para cada tipo de lição
 */
export function getLessonTypeText(type: LessonType | string): string {
  const normalizedType = type.toUpperCase();

  switch (normalizedType) {
    case "VIDEO":
      return "Vídeo";
    case "TEXT":
      return "Texto";
    case "OBJECTIVE_QUIZ":
      return "Atividade Objetiva";
    case "SUBJECTIVE_QUIZ":
      return "Atividade Subjetiva";
    default:
      return "Texto";
  }
}

/**
 * Mapeia tipo de lição do formato lowercase para UPPERCASE (DB format)
 */
export function mapLessonTypeToDb(type: string): LessonType {
  const mapping: Record<string, LessonType> = {
    video: "VIDEO",
    text: "TEXT",
    objective_quiz: "OBJECTIVE_QUIZ",
    subjective_quiz: "SUBJECTIVE_QUIZ",
  };

  return mapping[type.toLowerCase()] || "VIDEO";
}

/**
 * Mapeia tipo de lição do formato UPPERCASE para lowercase (UI format)
 */
export function mapLessonTypeFromDb(type: LessonType): string {
  const mapping: Record<LessonType, string> = {
    VIDEO: "video",
    TEXT: "text",
    OBJECTIVE_QUIZ: "objective_quiz",
    SUBJECTIVE_QUIZ: "subjective_quiz",
  };

  return mapping[type] || "video";
}

// ========================================
// COURSE STATUS HELPERS
// ========================================

/**
 * Retorna as classes CSS para cada status de curso
 */
export function getStatusColor(status: CourseStatus): string {
  switch (status) {
    case "published":
      return "text-green-400 bg-green-400/20 border border-green-400/30";
    case "draft":
      return "text-yellow-400 bg-yellow-400/20 border border-yellow-400/30";
    case "archived":
      return "text-gray-400 bg-gray-400/20 border border-gray-400/30";
  }
}

/**
 * Retorna o texto formatado para cada status
 */
export function getStatusText(status: CourseStatus): string {
  switch (status) {
    case "published":
      return "Publicado";
    case "draft":
      return "Rascunho";
    case "archived":
      return "Arquivado";
  }
}

/**
 * Retorna o ícone apropriado para cada status
 */
export function getStatusIcon(status: CourseStatus): LucideIcon {
  switch (status) {
    case "published":
      return CheckCircle;
    case "draft":
    case "archived":
      return FileText;
  }
}

// ========================================
// COURSE LEVEL HELPERS
// ========================================

/**
 * Retorna informações formatadas do nível do curso
 */
export function getLevelInfo(level: CourseLevel): {
  text: string;
  color: string;
} {
  switch (level) {
    case "beginner":
      return {
        text: "Iniciante",
        color: "text-green-400 bg-green-400/20 border border-green-400/30",
      };
    case "intermediate":
      return {
        text: "Intermediário",
        color: "text-yellow-400 bg-yellow-400/20 border border-yellow-400/30",
      };
    case "advanced":
      return {
        text: "Avançado",
        color: "text-red-400 bg-red-400/20 border border-red-400/30",
      };
  }
}

// ========================================
// DURATION HELPERS
// ========================================

/**
 * Formata duração em minutos para formato legível (Xh Ymin)
 */
export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}min`;
  }
  return `${mins}min`;
}

// ========================================
// FILE HELPERS
// ========================================

/**
 * Converte arquivo para base64 string
 */
export function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// ========================================
// STATS ICON MAPPING
// ========================================

/**
 * Mapeamento de ícones para cards de estatísticas
 */
export const statsIcons = {
  courses: BookOpen,
  published: TrendingUp,
  students: Users,
  completions: Award,
  duration: Clock,
} as const;

export type StatsIconKey = keyof typeof statsIcons;

/**
 * Retorna configuração de cor para ícones de stats
 */
export function getStatsIconConfig(key: StatsIconKey): {
  icon: LucideIcon;
  bgClass: string;
  iconClass: string;
} {
  const configs: Record<
    StatsIconKey,
    { icon: LucideIcon; bgClass: string; iconClass: string }
  > = {
    courses: {
      icon: BookOpen,
      bgClass: "dark-primary-subtle-bg",
      iconClass: "dark-primary",
    },
    published: {
      icon: TrendingUp,
      bgClass: "dark-success-bg",
      iconClass: "dark-success",
    },
    students: {
      icon: Users,
      bgClass: "dark-secondary-subtle-bg",
      iconClass: "dark-secondary",
    },
    completions: {
      icon: Award,
      bgClass: "dark-warning-bg",
      iconClass: "dark-warning",
    },
    duration: {
      icon: Clock,
      bgClass: "dark-info-bg",
      iconClass: "dark-info",
    },
  };

  return configs[key];
}
