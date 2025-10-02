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

export interface Notification {
  id: string;
  type:
    | "course_completed"
    | "certificate_ready"
    | "new_lesson"
    | "community_post"
    | "forum_reply";
  title: string;
  message: string;
  createdAt: Date;
  isRead: boolean;
  actionUrl?: string;
  metadata?: {
    courseName?: string;
    lessonName?: string;
    userName?: string;
    communityName?: string;
  };
}

interface NotificationsDropdownProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "course_completed":
      return <BookOpen className="h-4 w-4 text-green-500" />;
    case "certificate_ready":
      return <Award className="h-4 w-4 text-yellow-500" />;
    case "new_lesson":
      return <BookOpen className="h-4 w-4 text-blue-500" />;
    case "community_post":
      return <Users className="h-4 w-4 text-purple-500" />;
    case "forum_reply":
      return <MessageCircle className="h-4 w-4 text-orange-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
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

export function NotificationsDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: NotificationsDropdownProps) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5); // Mostra apenas as 5 mais recentes

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="dark-glass dark-border hover:dark-border-hover relative overflow-visible"
          size="icon-lg"
        >
          <Bell className="dark-text-primary" size={20} />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 flex h-2 w-2 items-center justify-center p-0 text-xs text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="max-h-96 w-80 overflow-y-auto"
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
                className={`group relative cursor-pointer border-b border-transparent p-0 transition-all duration-200 hover:border-blue-500/20 ${
                  !notification.isRead
                    ? "bg-gradient-to-r from-blue-500/5 to-purple-500/5"
                    : ""
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
                  {/* Ícone com background colorido */}
                  <div className="relative">
                    <div
                      className={`rounded-full p-2 ${
                        notification.type === "course_completed"
                          ? "bg-green-100 dark:bg-green-900/30"
                          : notification.type === "certificate_ready"
                            ? "bg-yellow-100 dark:bg-yellow-900/30"
                            : notification.type === "new_lesson"
                              ? "bg-blue-100 dark:bg-blue-900/30"
                              : notification.type === "community_post"
                                ? "bg-purple-100 dark:bg-purple-900/30"
                                : "bg-orange-100 dark:bg-orange-900/30"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    {!notification.isRead && (
                      <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-2">
                    {/* Header com tipo e timestamp */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-semibold tracking-wide uppercase ${
                            notification.type === "course_completed"
                              ? "text-green-600 dark:text-green-400"
                              : notification.type === "certificate_ready"
                                ? "text-yellow-600 dark:text-yellow-400"
                                : notification.type === "new_lesson"
                                  ? "text-blue-600 dark:text-blue-400"
                                  : notification.type === "community_post"
                                    ? "text-purple-600 dark:text-purple-400"
                                    : "text-orange-600 dark:text-orange-400"
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
                    <h4 className="dark-text-primary line-clamp-1 text-sm leading-tight font-semibold">
                      {notification.title}
                    </h4>

                    {/* Mensagem */}
                    <p className="dark-text-secondary line-clamp-2 text-xs leading-relaxed">
                      {notification.message}
                    </p>

                    {/* Metadata */}
                    {notification.metadata && (
                      <div className="flex flex-wrap gap-1">
                        {notification.metadata.courseName && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                            📚 {notification.metadata.courseName}
                          </span>
                        )}
                        {notification.metadata.lessonName && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                            📖 {notification.metadata.lessonName}
                          </span>
                        )}
                        {notification.metadata.userName && (
                          <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                            👤 {notification.metadata.userName}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Footer com ação */}
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        {!notification.isRead && (
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            Nova
                          </span>
                        )}
                      </div>

                      {!notification.isRead && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 opacity-0 transition-opacity group-hover:opacity-100"
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
