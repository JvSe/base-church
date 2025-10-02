"use client";

import { Badge } from "@base-church/ui/components/badge";
import { Button } from "@base-church/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@base-church/ui/components/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Award,
  Bell,
  BookOpen,
  Check,
  MessageCircle,
  Users,
  X,
} from "lucide-react";
import { type Notification } from "./notifications-dropdown";
import { notificationStyles } from "./styles-variants";

interface NotificationsDropdownVariantsProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  variant?: "modern" | "minimalist" | "card" | "timeline";
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "course_completed":
      return <BookOpen className="h-4 w-4" />;
    case "certificate_ready":
      return <Award className="h-4 w-4" />;
    case "new_lesson":
      return <BookOpen className="h-4 w-4" />;
    case "community_post":
      return <Users className="h-4 w-4" />;
    case "forum_reply":
      return <MessageCircle className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};

const getNotificationTypeLabel = (type: Notification["type"]) => {
  switch (type) {
    case "course_completed":
      return "Curso Concluído";
    case "certificate_ready":
      return "Certificado Pronto";
    case "new_lesson":
      return "Nova Lição";
    case "community_post":
      return "Post da Comunidade";
    case "forum_reply":
      return "Resposta no Fórum";
    default:
      return "Notificação";
  }
};

export function NotificationsDropdownVariants({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
  variant = "modern",
}: NotificationsDropdownVariantsProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);
  const styles = notificationStyles[variant];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="dark-glass dark-border hover:dark-border-hover relative overflow-visible"
          size="icon-lg"
        >
          <Bell className="dark-text-primary" size={20} />
          {unreadCount > 0 && (
            <div className="bg-dark-error absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="max-h-96 w-96 space-y-4 overflow-y-auto px-4"
        align="end"
        sideOffset={8}
      >
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notificações</span>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Bell className="mb-2 h-8 w-8 text-gray-400" />
            <p className="dark-text-secondary text-sm">Nenhuma notificação</p>
            <p className="dark-text-tertiary text-xs">Você está em dia!</p>
          </div>
        ) : (
          <>
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={`${styles.card} ${
                  !notification.isRead ? styles.unreadCard : ""
                }`}
                onClick={() => {
                  if (!notification.isRead) {
                    onMarkAsRead(notification.id);
                  }
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <div className="flex w-full items-start gap-4 p-4">
                  {/* Ícone */}
                  <div className={styles.iconContainer}>
                    <div
                      className={`${styles.iconBackground} ${
                        styles.iconBackgrounds[notification.type]
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    {!notification.isRead && (
                      <div className={styles.unreadDot} />
                    )}
                  </div>

                  <div className={styles.content}>
                    {/* Header */}
                    <div className={styles.header}>
                      <div className="flex items-center gap-2">
                        <span
                          className={`${styles.typeLabel} ${
                            styles.typeColors[notification.type]
                          }`}
                        >
                          {getNotificationTypeLabel(notification.type)}
                        </span>
                      </div>
                      <span className="dark-text-tertiary text-xs font-medium">
                        {formatDistanceToNow(notification.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>

                    {/* Título */}
                    <h4 className={styles.title}>{notification.title}</h4>

                    {/* Mensagem */}
                    <p className={styles.message}>{notification.message}</p>

                    {/* Metadata */}
                    {notification.metadata && (
                      <div className={styles.metadata}>
                        {notification.metadata.courseName && (
                          <span className={styles.metadataTag}>
                            📚 {notification.metadata.courseName}
                          </span>
                        )}
                        {notification.metadata.lessonName && (
                          <span className={styles.metadataTag}>
                            📖 {notification.metadata.lessonName}
                          </span>
                        )}
                        {notification.metadata.userName && (
                          <span className={styles.metadataTag}>
                            👤 {notification.metadata.userName}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer */}
                    <div className={styles.footer}>
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <span className={styles.newLabel}>Nova</span>
                        )}
                      </div>

                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className={styles.actionButton}
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkAsRead(notification.id);
                          }}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}

            {notifications.length > 5 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-center">
                  <span className="dark-text-tertiary text-xs">
                    Ver todas as notificações ({notifications.length})
                  </span>
                </DropdownMenuItem>
              </>
            )}
          </>
        )}

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <div className="flex gap-2 p-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs"
                  onClick={onMarkAllAsRead}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Marcar como lidas
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={onClearAll}
              >
                <X className="mr-1 h-3 w-3" />
                Limpar todas
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
