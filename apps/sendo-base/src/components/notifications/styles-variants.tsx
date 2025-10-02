// Variações de estilo para os cards de notificação
// Use estas classes para alternar entre diferentes designs

export const notificationStyles = {
  // Estilo atual (moderno com ícones coloridos)
  modern: {
    card: "group relative cursor-pointer border-b border-transparent p-0 transition-all duration-200 hover:border-blue-500/20",
    unreadCard: "bg-gradient-to-r from-blue-500/5 to-purple-500/5",
    iconContainer: "relative",
    iconBackground: "rounded-full p-2",
    iconBackgrounds: {
      course_completed: "bg-green-100 dark:bg-green-900/30",
      certificate_ready: "bg-yellow-100 dark:bg-yellow-900/30",
      new_lesson: "bg-blue-100 dark:bg-blue-900/30",
      community_post: "bg-purple-100 dark:bg-purple-900/30",
      forum_reply: "bg-orange-100 dark:bg-orange-900/30",
    },
    unreadDot:
      "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900",
    content: "min-w-0 flex-1 space-y-2",
    header: "flex items-start justify-between",
    typeLabel: "text-xs font-semibold uppercase tracking-wide",
    typeColors: {
      course_completed: "text-green-600 dark:text-green-400",
      certificate_ready: "text-yellow-600 dark:text-yellow-400",
      new_lesson: "text-blue-600 dark:text-blue-400",
      community_post: "text-purple-600 dark:text-purple-400",
      forum_reply: "text-orange-600 dark:text-orange-400",
    },
    title: "dark-text-primary line-clamp-1 text-sm font-semibold leading-tight",
    message: "dark-text-secondary line-clamp-2 text-xs leading-relaxed",
    metadata: "flex flex-wrap gap-1",
    metadataTag:
      "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium",
    footer: "flex items-center justify-between pt-1",
    newLabel: "text-xs font-medium text-blue-600 dark:text-blue-400",
    actionButton:
      "h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100",
  },

  // Estilo minimalista (clean e simples)
  minimalist: {
    card: "group relative cursor-pointer p-0 transition-all duration-150 hover:bg-gray-50/50 dark:hover:bg-gray-800/50",
    unreadCard: "bg-blue-50/30 dark:bg-blue-900/10 border-l-2 border-blue-500",
    iconContainer: "flex items-center justify-center",
    iconBackground: "p-1.5",
    iconBackgrounds: {
      course_completed: "text-green-600 dark:text-green-400",
      certificate_ready: "text-yellow-600 dark:text-yellow-400",
      new_lesson: "text-blue-600 dark:text-blue-400",
      community_post: "text-purple-600 dark:text-purple-400",
      forum_reply: "text-orange-600 dark:text-orange-400",
    },
    unreadDot:
      "absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-blue-500",
    content: "min-w-0 flex-1",
    header: "flex items-center justify-between mb-2",
    typeLabel: "text-xs font-medium",
    typeColors: {
      course_completed: "text-green-600 dark:text-green-400",
      certificate_ready: "text-yellow-600 dark:text-yellow-400",
      new_lesson: "text-blue-600 dark:text-blue-400",
      community_post: "text-purple-600 dark:text-purple-400",
      forum_reply: "text-orange-600 dark:text-orange-400",
    },
    title: "dark-text-primary text-sm font-medium mb-1",
    message: "dark-text-secondary text-xs leading-relaxed",
    metadata: "mt-2 space-y-1",
    metadataTag: "block text-xs",
    footer: "flex items-center justify-between mt-3",
    newLabel: "text-xs font-medium text-blue-600 dark:text-blue-400",
    actionButton:
      "h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100",
  },

  // Estilo card (como cards independentes)
  card: {
    card: "group relative cursor-pointer rounded-lg border border-gray-200 dark:border-gray-700 p-0 transition-all duration-200 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600",
    unreadCard: "border-blue-500 bg-blue-50/20 dark:bg-blue-900/10 shadow-sm",
    iconContainer: "flex items-center justify-center",
    iconBackground: "rounded-full p-2",
    iconBackgrounds: {
      course_completed:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      certificate_ready:
        "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
      new_lesson:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      community_post:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      forum_reply:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    },
    unreadDot: "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500",
    content: "min-w-0 flex-1",
    header: "flex items-start justify-between mb-3",
    typeLabel: "text-xs font-semibold uppercase tracking-wide",
    typeColors: {
      course_completed: "text-green-600 dark:text-green-400",
      certificate_ready: "text-yellow-600 dark:text-yellow-400",
      new_lesson: "text-blue-600 dark:text-blue-400",
      community_post: "text-purple-600 dark:text-purple-400",
      forum_reply: "text-orange-600 dark:text-orange-400",
    },
    title: "dark-text-primary text-sm font-semibold mb-2",
    message: "dark-text-secondary text-xs leading-relaxed mb-3",
    metadata: "flex flex-wrap gap-2 mb-3",
    metadataTag:
      "inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300",
    footer:
      "flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-700",
    newLabel: "text-xs font-medium text-blue-600 dark:text-blue-400",
    actionButton:
      "h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100",
  },

  // Estilo timeline (como uma linha do tempo)
  timeline: {
    card: "group relative cursor-pointer p-0 transition-all duration-200",
    unreadCard:
      "bg-gradient-to-r from-transparent via-blue-500/5 to-transparent",
    iconContainer: "relative flex items-center justify-center",
    iconBackground: "rounded-full p-2 border-2",
    iconBackgrounds: {
      course_completed:
        "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 text-green-600 dark:text-green-400",
      certificate_ready:
        "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
      new_lesson:
        "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
      community_post:
        "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
      forum_reply:
        "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400",
    },
    unreadDot:
      "absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900",
    content: "min-w-0 flex-1 ml-4",
    header: "flex items-center justify-between mb-2",
    typeLabel: "text-xs font-medium uppercase tracking-wide",
    typeColors: {
      course_completed: "text-green-600 dark:text-green-400",
      certificate_ready: "text-yellow-600 dark:text-yellow-400",
      new_lesson: "text-blue-600 dark:text-blue-400",
      community_post: "text-purple-600 dark:text-purple-400",
      forum_reply: "text-orange-600 dark:text-orange-400",
    },
    title: "dark-text-primary text-sm font-semibold mb-1",
    message: "dark-text-secondary text-xs leading-relaxed mb-2",
    metadata: "flex flex-wrap gap-1 mb-2",
    metadataTag:
      "inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-800 px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300",
    footer: "flex items-center justify-between",
    newLabel: "text-xs font-medium text-blue-600 dark:text-blue-400",
    actionButton:
      "h-6 w-6 p-0 opacity-0 transition-opacity group-hover:opacity-100",
  },
};

// Função helper para aplicar os estilos
export const getNotificationStyles = (
  variant: keyof typeof notificationStyles,
) => {
  return notificationStyles[variant];
};
