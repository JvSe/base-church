// Exportar o componente principal
export { useNotifications } from "./hook";
export { NotificationsButton } from "./notifications-button";
export { NotificationsDropdown } from "./notifications-dropdown";
export { NotificationsDropdownVariants } from "./notifications-dropdown-variants";

// Exportar helpers para criar notificações
export {
  notifyCertificateReady,
  notifyCommunityPost,
  notifyCourseCompleted,
  notifyForumReply,
  notifyNewLesson,
} from "./notification-helpers";

// Exportar tipos
export type { Notification } from "./notifications-dropdown";
