import type { LucideIcon } from "lucide-react";
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  TrendingUp,
  Users,
} from "lucide-react";

/**
 * Helpers para Sistema de Eventos
 *
 * Seguindo o mesmo padrão dos helpers de cursos
 */

// ========================================
// EVENT STATUS HELPERS
// ========================================

export type EventStatus = "draft" | "published" | "archived" | "completed";

/**
 * Retorna as classes CSS para cada status de evento
 */
export function getEventStatusColor(status: EventStatus): string {
  switch (status) {
    case "published":
      return "text-green-400 bg-green-400/20 border border-green-400/30";
    case "draft":
      return "text-yellow-400 bg-yellow-400/20 border border-yellow-400/30";
    case "archived":
      return "text-gray-400 bg-gray-400/20 border border-gray-400/30";
    case "completed":
      return "text-blue-400 bg-blue-400/20 border border-blue-400/30";
  }
}

/**
 * Retorna o texto formatado para cada status
 */
export function getEventStatusText(status: EventStatus): string {
  switch (status) {
    case "published":
      return "Publicado";
    case "draft":
      return "Rascunho";
    case "archived":
      return "Arquivado";
    case "completed":
      return "Concluído";
  }
}

/**
 * Retorna o ícone apropriado para cada status
 */
export function getEventStatusIcon(status: EventStatus): LucideIcon {
  switch (status) {
    case "published":
      return CheckCircle;
    case "draft":
    case "archived":
    case "completed":
      return FileText;
  }
}

// ========================================
// EVENT TYPE HELPERS
// ========================================

export type EventType = "online" | "presential" | "hybrid";

/**
 * Retorna informações formatadas do tipo de evento
 */
export function getEventTypeInfo(type: EventType): {
  text: string;
  color: string;
  icon: LucideIcon;
} {
  switch (type) {
    case "online":
      return {
        text: "Online",
        color: "text-blue-400 bg-blue-400/20 border border-blue-400/30",
        icon: Clock,
      };
    case "presential":
      return {
        text: "Presencial",
        color: "text-purple-400 bg-purple-400/20 border border-purple-400/30",
        icon: MapPin,
      };
    case "hybrid":
      return {
        text: "Híbrido",
        color: "text-orange-400 bg-orange-400/20 border border-orange-400/30",
        icon: Calendar,
      };
  }
}

// ========================================
// STATS ICON MAPPING
// ========================================

/**
 * Mapeamento de ícones para cards de estatísticas de eventos
 */
export const eventStatsIcons = {
  events: Calendar,
  published: TrendingUp,
  participants: Users,
  completed: Award,
  upcoming: Clock,
} as const;

export type EventStatsIconKey = keyof typeof eventStatsIcons;

/**
 * Retorna configuração de cor para ícones de stats de eventos
 */
export function getEventStatsIconConfig(key: EventStatsIconKey): {
  icon: LucideIcon;
  bgClass: string;
  iconClass: string;
} {
  const configs: Record<
    EventStatsIconKey,
    { icon: LucideIcon; bgClass: string; iconClass: string }
  > = {
    events: {
      icon: Calendar,
      bgClass: "dark-primary-subtle-bg",
      iconClass: "dark-primary",
    },
    published: {
      icon: TrendingUp,
      bgClass: "dark-success-bg",
      iconClass: "dark-success",
    },
    participants: {
      icon: Users,
      bgClass: "dark-secondary-subtle-bg",
      iconClass: "dark-secondary",
    },
    completed: {
      icon: Award,
      bgClass: "dark-warning-bg",
      iconClass: "dark-warning",
    },
    upcoming: {
      icon: Clock,
      bgClass: "dark-info-bg",
      iconClass: "dark-info",
    },
  };

  return configs[key];
}

