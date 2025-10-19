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

export type Notification = {
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
  read: boolean;
  actionUrl?: string;
  metadata?: {
    courseName?: string;
    lessonName?: string;
    userName?: string;
    communityName?: string;
  };
};

type NotificationsDropdownProps = {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
};

const getNotificationIcon = (type: Notification["type"]) => {
  const iconClass = "h-4 w-4";
  switch (type) {
    case "course_completed":
      return <BookOpen className={iconClass} />;
    case "certificate_ready":
      return <Award className={iconClass} />;
    case "new_lesson":
      return <BookOpen className={iconClass} />;
    case "community_post":
      return <Users className={iconClass} />;
    case "forum_reply":
      return <MessageCircle className={iconClass} />;
    default:
      return <Bell className={iconClass} />;
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

const getIconBackground = (type: Notification["type"]) => {
  switch (type) {
    case "course_completed":
      return "bg-green-100 dark:bg-green-900/30";
    case "certificate_ready":
      return "bg-yellow-100 dark:bg-yellow-900/30";
    case "new_lesson":
      return "bg-blue-100 dark:bg-blue-900/30";
    case "community_post":
      return "bg-purple-100 dark:bg-purple-900/30";
    case "forum_reply":
      return "bg-orange-100 dark:bg-orange-900/30";
  }
};

const getTypeColor = (type: Notification["type"]) => {
  switch (type) {
    case "course_completed":
      return "text-green-600 dark:text-green-400";
    case "certificate_ready":
      return "text-yellow-600 dark:text-yellow-400";
    case "new_lesson":
      return "text-blue-600 dark:text-blue-400";
    case "community_post":
      return "text-purple-600 dark:text-purple-400";
    case "forum_reply":
      return "text-orange-600 dark:text-orange-400";
  }
};

export function NotificationsDropdown({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll,
}: NotificationsDropdownProps) {
  const unreadCount = notifications.filter((n) => !n.read).length;
  const recentNotifications = notifications.slice(0, 5);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="dark-glass dark-border hover:dark-border-hover relative overflow-visible transition-all duration-300 hover:scale-105"
          size="icon-lg"
        >
          <Bell
            className="dark-text-primary transition-transform duration-300 hover:rotate-12"
            size={20}
          />
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-red-600 text-xs font-bold text-white shadow-lg ring-2 ring-white dark:ring-gray-900">
              {unreadCount > 9 ? "9+" : unreadCount}
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="dark-glass dark-border max-h-[32rem] w-[500px] overflow-hidden rounded-xl shadow-2xl backdrop-blur-xl"
        align="end"
        sideOffset={12}
      >
        {/* Header */}
        <DropdownMenuLabel className="flex items-center justify-between px-4 py-3">
          <span className="dark-text-primary text-base font-bold">
            Notificações
          </span>
          {unreadCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
            >
              {unreadCount} não lida{unreadCount !== 1 ? "s" : ""}
            </Badge>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="dark-border" />

        {/* Notifications List */}
        <div className="custom-scrollbar max-h-[24rem] overflow-y-auto px-5">
          {recentNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="dark-glass mb-3 rounded-full p-4">
                <Bell className="h-8 w-8 text-gray-400" />
              </div>
              <p className="dark-text-secondary text-sm font-medium">
                Nenhuma notificação
              </p>
              <p className="dark-text-tertiary mt-1 text-xs">
                Você está em dia! 🎉
              </p>
            </div>
          ) : (
            <>
              {recentNotifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`group dark-border relative cursor-pointer overflow-hidden border-b p-0 transition-all duration-300 ${
                    !notification.read
                      ? "bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10"
                      : "hover:dark-bg-secondary"
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      onMarkAsRead(notification.id);
                    }
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                  }}
                >
                  <div className="flex w-full items-start gap-3 p-4">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`rounded-xl p-2.5 transition-transform duration-300 group-hover:scale-110 ${getIconBackground(notification.type)}`}
                      >
                        {getNotificationIcon(notification.type)}
                      </div>
                      {!notification.read && (
                        <div className="absolute -top-1 -right-1 h-3 w-3 animate-pulse rounded-full bg-blue-500 ring-2 ring-white dark:ring-gray-900" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1 space-y-2">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <span
                          className={`text-xs font-bold tracking-wider uppercase ${getTypeColor(notification.type)}`}
                        >
                          {getNotificationTypeLabel(notification.type)}
                        </span>
                        <span className="dark-text-tertiary text-xs font-medium whitespace-nowrap">
                          {formatDistanceToNow(notification.createdAt, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="dark-text-primary line-clamp-1 text-sm leading-tight font-bold">
                        {notification.title}
                      </h4>

                      {/* Message */}
                      <p className="dark-text-secondary line-clamp-2 text-xs leading-relaxed">
                        {notification.message}
                      </p>

                      {/* Metadata */}
                      {notification.metadata && (
                        <div className="flex flex-wrap gap-1.5">
                          {notification.metadata.courseName && (
                            <span className="dark-glass dark-text-secondary dark-border inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium">
                              📚 {notification.metadata.courseName}
                            </span>
                          )}
                          {notification.metadata.lessonName && (
                            <span className="dark-glass dark-text-secondary dark-border inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium">
                              📖 {notification.metadata.lessonName}
                            </span>
                          )}
                          {notification.metadata.userName && (
                            <span className="dark-glass dark-text-secondary dark-border inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium">
                              👤 {notification.metadata.userName}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-1">
                        {!notification.read && (
                          <span className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                            Nova
                          </span>
                        )}

                        {!notification.read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="ml-auto h-7 w-7 p-0 opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110 hover:bg-green-100 dark:hover:bg-green-900/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              onMarkAsRead(notification.id);
                            }}
                          >
                            <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}

              {notifications.length > 5 && (
                <>
                  <DropdownMenuSeparator className="dark-border" />
                  <DropdownMenuItem className="hover:dark-bg-secondary cursor-pointer justify-center py-3 text-center transition-colors">
                    <span className="dark-text-tertiary text-xs font-semibold">
                      Ver todas as notificações ({notifications.length})
                    </span>
                  </DropdownMenuItem>
                </>
              )}
            </>
          )}
        </div>

        {/* Actions */}
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="dark-border" />
            <div className="flex gap-2 p-3">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="dark-border flex-1 text-xs font-semibold transition-all duration-300 hover:scale-105"
                  onClick={onMarkAllAsRead}
                >
                  <Check className="mr-1.5 h-3.5 w-3.5" />
                  Marcar todas lidas
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="dark-border flex-1 text-xs font-semibold transition-all duration-300 hover:scale-105"
                onClick={onClearAll}
              >
                <X className="mr-1.5 h-3.5 w-3.5" />
                Limpar todas
              </Button>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
